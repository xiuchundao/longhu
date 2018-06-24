class DiscloseReason(object):
    SUCCESS_CODE = 1003
    SUCCESS_MSG = '成功'

    FAILED_CODE = 1001
    FAILED_MSG = '失败'

    def __init__(self, code, message):
        self.code = code
        self.message = message
