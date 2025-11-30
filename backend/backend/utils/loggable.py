import logging
from typing import Any


class Loggable:
    """
    A mixin that adds a .log() method to classes, returning a logger
    named after the class.
    """

    _logger: logging.Logger | None = None

    @classmethod
    def log(cls) -> logging.Logger:
        if cls._logger is None:
            cls._logger = logging.getLogger(cls.__name__)
            # Ensure we have at least a basic handler if none exists
            if not cls._logger.handlers:
                handler = logging.StreamHandler()
                formatter = logging.Formatter(
                    "[%(asctime)s] [%(name)s] [%(levelname)s] %(message)s",
                    datefmt="%Y-%m-%d %H:%M:%S",
                )
                handler.setFormatter(formatter)
                cls._logger.addHandler(handler)
                cls._logger.setLevel(logging.INFO)
        return cls._logger

    def debug(self, msg: Any, *args: Any, **kwargs: Any) -> None:
        self.log().debug(msg, *args, **kwargs)

    def info(self, msg: Any, *args: Any, **kwargs: Any) -> None:
        self.log().info(msg, *args, **kwargs)

    def warning(self, msg: Any, *args: Any, **kwargs: Any) -> None:
        self.log().warning(msg, *args, **kwargs)

    def error(self, msg: Any, *args: Any, **kwargs: Any) -> None:
        self.log().error(msg, *args, **kwargs)
