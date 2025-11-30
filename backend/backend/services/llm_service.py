from pydantic import BaseModel
from pydantic_ai import Agent
from pydantic_ai.models.openai import OpenAIModel

from backend.utils.config import AppConfig
from backend.utils.loggable import Loggable


class LLMService(Loggable):
    """
    Service for structured LLM interactions using pydantic-ai.
    """

    def __init__(self, cfg: AppConfig):
        self.cfg = cfg
        # TODO: Add openai_api_key to AppConfig if not present
        self.api_key = getattr(self.cfg, "openai_api_key", None)

        if not self.api_key:
            self.log().warning("OPENAI_API_KEY not set in AppConfig")

    async def extract_structured_data(
        self,
        prompt: str,
        output_model: type[BaseModel],
        system_prompt: str = "You are a helpful assistant.",
        model_name: str = "gpt-4o",
    ) -> BaseModel:
        """
        Send a prompt to the LLM and get a response structured according to output_model.
        """
        if not self.api_key:
            raise ValueError("OpenAI API key is missing")

        # Initialize the model with the API key
        model = OpenAIModel(model_name, api_key=self.api_key)

        agent = Agent(model, output_type=output_model, system_prompt=system_prompt)

        result = await agent.run(prompt)
        return result.data

    async def chat(
        self,
        messages: list[str],
        model_name: str = "gpt-4o",
    ) -> str:
        """
        Simple chat completion.
        """
        if not self.api_key:
            raise ValueError("OpenAI API key is missing")

        model = OpenAIModel(model_name, api_key=self.api_key)
        agent = Agent(model)

        # Simple concatenation for this example, ideally use structured messages
        prompt = "\n".join(messages)
        result = await agent.run(prompt)
        return result.data
