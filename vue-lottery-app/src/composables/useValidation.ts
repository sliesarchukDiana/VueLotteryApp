export function useValidation() {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\+380\d{9}$/;

    const isRequired = (value: string) => !!value.trim();

    const isValidEmail = (email: string) => emailRegex.test(email.trim());

    const isValidPhone = (phone: string) => phoneRegex.test(phone.trim());

    const isNotFutureDate = (dateString: string) => {
        if (!dateString) return false;
        const selectedDate = new Date(dateString);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return selectedDate <= today;
    };

    return {
        isRequired,
        isValidEmail,
        isValidPhone,
        isNotFutureDate
    };
}