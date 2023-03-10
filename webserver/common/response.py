from rest_framework.response import Response

class ErrorResponse(Response):
    def __init__(self, reason, *args, **kwargs):
        super().__init__(
            *args,
            **kwargs,
            data=dict(
                reason=reason,
            ),
            status=400,
        )
