export default class ApiError extends Error {
    status;
    errors;

    constructor(status, message, errors = []) {
        super(message);
        this.status = status;
        this.errors = errors;
    }

    static UnauthorizedError() {
        return new ApiError(401, 'Пользователь не авторизован')
    }

    static NotEnoughRights() {
        return new ApiError(402, 'У пользователя недостаточно прав для выполнения действия')
    }

    static BadRequest(message, errors = []) {
        return new ApiError(400, message, errors);
    }

    static InitFailed(message, errors = []) {
        return new ApiError(500, message);
    }
    static ValidationError(message, errors = []){
        return new ApiError(600, 'Ошибка валидации');
    }
    static WeakPassword(){
        return new ApiError(601, 'Пароль не соответствует предьявляемым требованиям!');
    }
    static UserNotExists(email) {
        return new ApiError(602, `Пользователь с логином ${email}, не зарегистрирован!`);
    }
    static RestoreLinkExpired() {
        return new ApiError(603, `Ссылка для восстановления пароля просрочена!`);
    }
    static BadRestoreKey() {
        return new ApiError(604, `Неверный ключ для восстановления пароля!`);
    }

    static BadBase64() {
        return new ApiError(605, `Входные данные не являются данными base64!`);
    }

    static BadAttachmentUpload(name) {
        return new ApiError(606, `Не удалось сохранить файл вложения: ${name}`);
    }
}