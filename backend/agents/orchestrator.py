import asyncio
from typing import List, Dict
from langchain_groq import ChatGroq
from langchain_core.prompts import ChatPromptTemplate

from models.schemas import Job, MachineDowntime, ShiftConstraints, AgentResult, ComparisonResponse
from .base_agent import BaseAgent
from .baseline_agent import BaselineAgent
from .batching_agent import BatchingAgent
from .bottleneck_agent import BottleneckAgent
from .constraint_agent import ConstraintAgent
from config import settings

class OrchestratorAgent(BaseAgent):
    def __init__(self):
        super().__init__("Orchestrator Agent")
        self.baseline = BaselineAgent()
        self.batching = BatchingAgent()
        self.bottleneck = BottleneckAgent()
        self.constraint = ConstraintAgent()
        
        self.llm = ChatGroq(
            api_key=settings.GROQ_API_KEY,
            model_name=settings.MODEL_NAME
        )

    async def optimize(
        self, 
        jobs: List[Job], 
        downtimes: List[MachineDowntime], 
        constraints: ShiftConstraints
    ) -> AgentResult:
        self.log("Orchestrating all agents...")
        
        # Run all agents in parallel
        results = await asyncio.gather(
            self.baseline.optimize(jobs, downtimes, constraints),
            self.batching.optimize(jobs, downtimes, constraints),
            self.bottleneck.optimize(jobs, downtimes, constraints)
        )
        
        baseline_res, batching_res, bottleneck_res = results
        
        # Validate all schedules
        for res in results:
            res.violations = self.constraint.validate(res.schedules, jobs, downtimes, constraints)
            
        # Select Best
        # Scoring logic: High Score is better. If violations exist, penalize heavily.
        candidates = [baseline_res, batching_res, bottleneck_res]
        
        best_agent = None
        best_score = -float('inf')
        
        for cand in candidates:
            # Penalty for violations
            penalty = len(cand.violations) * 50
            final_score = cand.kpis.score - penalty
            
            if final_score > best_score:
                best_score = final_score
                best_agent = cand
        
        # Generate Meta-Explanation
        explanation = await self._generate_meta_explanation(best_agent, candidates)
        
        # Return the best result, but we might want to attach the comparison data elsewhere
        # usage: The API will likely call a specific 'compare' method if it wants all data.
        # optimize() returns just the single best result to fit the interface.
        
        best_agent.explanation = f"[Orchestrated Selection] Selected {best_agent.agent_name} as optimal strategy.\n\n" + explanation
        return best_agent

    async def compare_all(self, jobs, downtimes, constraints) -> ComparisonResponse:
        results = await asyncio.gather(
            self.baseline.optimize(jobs, downtimes, constraints),
            self.batching.optimize(jobs, downtimes, constraints),
            self.bottleneck.optimize(jobs, downtimes, constraints)
        )
        
        # Validate
        for res in results:
            res.violations = self.constraint.validate(res.schedules, jobs, downtimes, constraints)
            
        # Run Orchestrator logic to get "Its own" view (or just pick best)
        # We can treat the 'Orchestrated' result as the Decision Wrapper
        best_res = await self.optimize(jobs, downtimes, constraints)
        
        return ComparisonResponse(
            baseline=results[0],
            batching=results[1],
            bottleneck=results[2],
            orchestrated=best_res,
            summary=best_res.explanation
        )

    async def _generate_meta_explanation(self, best, candidates):
        try:
            summary = "\n".join([f"{c.agent_name}: Score {c.kpis.score}, Violations {len(c.violations)}" for c in candidates])
            prompt = ChatPromptTemplate.from_template(
                """
                You are a Production Supervisor.
                We compared 3 scheduling strategies:
                {summary}
                
                The winner is {winner}.
                Explain why this strategy was chosen over the others. fast and concise.
                """
            )
            chain = prompt | self.llm
            res = await chain.ainvoke({
                "summary": summary,
                "winner": best.agent_name
            })
            return res.content
        except Exception as e:
            return "Orchestrator selected the strategy with highest score and fewest violations."
