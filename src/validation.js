const emailPattern =     /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const mobilePattern =  /^(\\d{1,3}[- ]?)?\d{10}$/



export function validateName(name) {
    if(name.length < 1) {
        return false;
    } else {
        return true;
    }
}

export function validateEmail(email) {
 if(emailPattern.test(email)) {
     return true;
 } else {
     return false;
 }
}

export function validatePhone(phone) {
    if(mobilePattern.test(phone)) {
        return true
    } else {
        return false
    }
}