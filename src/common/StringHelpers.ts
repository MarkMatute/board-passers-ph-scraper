class StringHelper {

    public static isNumber = (text: string) => {
        return /^-{0,1}\d+$/.test(text);
    }

    public static removeNumbers = (text: string) => {
        return text.replace(/[0-9]/g, '').trimLeft();
    }

}

export default StringHelper;