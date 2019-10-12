class StringHelper {

    public static isNumber = (text: string) => {
        return /^-{0,1}\d+$/.test(text);
    }

    public static removeNumbers = (text: string) => {
        return text.replace(/[0-9]/g, '').trimLeft();
    }

    public static removeMonthAndYear = (text: string) => {
        return text
            .toLowerCase()
            .replace(/january/g, '')
            .replace(/february/g, '')
            .replace(/march/g, '')
            .replace(/april/g, '')
            .replace(/may/g, '')
            .replace(/june/g, '')
            .replace(/july/g, '')
            .replace(/august/g, '')
            .replace(/september/g, '')
            .replace(/october/g, '')
            .replace(/november/g, '')
            .replace(/december/g, '')
            .replace(/[0-9]/g, '')
            .replace(/-/g, '')
            .trimLeft();
    }

    public static spaceToUnderscore = (text: string) => {
        return text.toLowerCase().replace(' ', '_');
    }

}

export default StringHelper;
