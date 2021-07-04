function validateForm() {
    var firstName = document.getElementById("firstName");
    var lastName = document.getElementById("lastName");
    var cityName = document.getElementById("city");
    var nationality = document.getElementById("nationality");
    var passportNo = document.getElementById("passportNo");

    var nameRegex = /^[a-z ,.'-]+$/i;
    var cityandCountryNameRegex = /^[a-zA-Z]+(?:[\s-][a-zA-Z]+)*$/;
    var passportNoRegex = /^\d+$/;

    if(firstName.value.length >= 3 && firstName.value.length <= 25 && lastName.value.length >= 3 && lastName.value.length <= 25) {
        if(!(nameRegex.test(firstName.value + " " + lastName.value))) {
            alert("Error: Name must only contain alphabets and special characters like (.),('),(-)");
            return false
        }
    }
    else if((firstName.value.length < 3 || firstName.value.length > 25) || (lastName.value.length < 3 || lastName.value.length > 25)) {
        alert("Error: Length of First Name and Last Name fields should not be greater than 25 and less than 3");
        return false;
    }

    //Will reach here only when First Name and LastName is correct
    if(nationality.value.length >= 3 && nationality.value.length <= 20) {
        if(!(cityandCountryNameRegex.test(nationality.value))) {
            alert("Error: Country name must contain only alphabetical characters");
            return false;
        }
    }
    else if(nationality.value.length < 3 || nationality.value.length > 20) {
        alert("Error: Country name length should not be greater than 20 and less than 3");
        return false;
    }

    if(cityName.value.trim().length) {
        if(cityName.value.length >= 3 && cityName.value.length <= 30) {
            if(!(cityandCountryNameRegex.test(cityName.value))) {
                alert("Error: City name must contain only alphabetical characters");
                return false;
            }
        }
        else if(cityName.value.length < 3 || cityName.value.length > 30) {
            alert("Error: City name length should not be greater than 30 and less than 3");
            return false;
        }
    }

    if(passportNo.value.trim().length) {
        if(passportNo.value.length >= 9 && passportNo.value.length <= 10) {
            if(!(passportNoRegex.test(passportNo.value))) {
                alert("Error: Passport No should only contain numeric characters (0, 9)");
                return false;
            }
        }
        else if(passportNo.value.length < 9 || passportNo.value.length > 10) {
            alert("Error: Length of Passport no cannot be greater than 10 and less than 9");
            return false;
        }
    }
}