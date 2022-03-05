<script>
  import {fly, fade } from 'svelte/transition';	
  export let formTitle = "Form Title"
  export let formMessage = "Send us a message and our team will be in touch"
  export let sendToEmail;
	let hasError = false;
	let isSuccessVisible = false;
  let submitted = false;
  const emailPattern =     /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  const mobilePattern =  /^(\\d{1,3}[- ]?)?\d{10}$/

	
  const errMessage = "All the fields are mandatory";		
  
  let fields = {
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    messageArea: ''

  }
  let errors = {
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    messageArea: ''
  }

  let errorsValid = {
    firstNameValid: true,
    lastNameValid: true,
    emailValid: true,
    phoneNumberValid: true,
    messageAreaValid: true
  }
  let valid = false;
  
  
  function validate() {
    if(fields.firstName.length < 1) {
      errorsValid.firstNameValid = false
    } else {
      errorsValid.firstNameValid = true

    }

      if(fields.lastName.length < 1) {
      errorsValid.lastNameValid = false
    } else {
      errorsValid.lastNameValid = true
    }

    if(!emailPattern.test(fields.email)) {
      errorsValid.emailValid = false
    } else {
      errorsValid.emailValid = true
    }

    if(!mobilePattern.test(fields.phoneNumber)) {
      errorsValid.phoneNumberValid = false
    } else {
      errorsValid.phoneNumberValid = true
    }
  }

	function handleSubmit(e) {

    valid = true;
    if(fields.firstName.length < 1) {
      errors.firstName = "Please enter your first name."
      errorsValid.firstNameValid = false
    }
    if(fields.lastName.length < 1) {
      errors.lastName = "Please enter your last name"
    }

    if(!emailPattern.test(fields.email) ) {
      errors.lastName = "Please enter a valid email address"
    }

     if(!mobilePattern.test(fields.phoneNumber) ) {
       console.log('incorrect number')
      errors.lastName = "Please enter a valid contact number"
    }


		isSuccessVisible = true;

		setTimeout(function(){
			isSuccessVisible = false;
		}, 4000);
	}
</script>

<h2>Take survey</h2>	

{#if hasError == true}
		<p class="error-alert">{errMessage}</p>
{:else}
	{#if isSuccessVisible}	
		<p class="error-alert" transition:fade={{duration:150}}>Data updated successfully</p>
	{/if}
{/if}

<div class="container">

  <form id="surveyForm" class="mt-4" class:submitted on:submit|preventDefault={handleSubmit}>
    <h3>{formTitle}</h3>
  <h4>{formMessage}</h4>
		<div class="form-group">
    <input type="text" class="form-control {errorsValid.firstNameValid ? '' : 'invalid'}" bind:value="{fields.firstName}" on:keyup="{validate}" placeholder="First name" required>
		</div>

		<div class="form-group">
    <input type="text" class="form-control {errorsValid.lastNameValid ? '' : 'invalid'}" bind:value="{fields.lastName}" on:keyup="{validate}"  placeholder="Last name" required>
    </div> 
    
    <div class="form-group">
			<input type="email" class="form-control {errorsValid.emailValid ? '' : 'invalid'}" bind:value="{fields.email}" on:keyup="{validate}"  placeholder="Email" required>
    </div> 
    
    <div class="form-group">
			<input type="text" class="form-control {errorsValid.phoneNumberValid ? '' : 'invalid'}" bind:value="{fields.phoneNumber}" on:keyup="{validate}"  placeholder="Contact number" required>
    </div> 
    
    <div class="form-group">
      <textarea rows="4" class="form-control" bind:value="{fields.messageArea}" placeholder="Give us the deets"></textarea>
		</div> 


		<button class="btn btn-full" on:click={() => submitted = true} >Continue</button>
	</form>
</div>

<link href="https://gist.githubusercontent.com/Ajax30/08899d40e16069cd517b9756dc900acc/raw/04e4f9997245df079fa8500690d1878311115b20/global.css" rel="stylesheet" crossorigin="anonymous">

<style type="text/scss">
@import './public/scss/theme.scss';
@import './public/scss/breakpoints.scss';

	.container {
		max-width: 400px !important;
		width: 100%;
    margin: 0 auto;
    position: relative;
	}
	
	h2 {
		margin-top: 0;
	}
	
	.form-group > *,
	.btn-full {
		width: 100%;
	}
	
	.form-control,
	.btn-full {
		border-radius: 3px;
	}

	.submitted input:invalid {
		border: 1px solid #070;
	}

	.submitted input:focus:invalid {
		outline: 1px solid #c00;
	}
	
	.error-alert {
		border: 1px solid #080 !important;
		padding: 6px;
		text-align: center;
		color: #080;
		border-radius: 3px;
	}

  #surveyForm input[type="text"],
#surveyForm input[type="email"],
#surveyForm input[type="tel"],
#surveyForm input[type="url"],
#surveyForm textarea,
#surveyForm button[type="submit"] {
  font: 400 12px/16px "Roboto", Helvetica, Arial, sans-serif;
}

#surveyForm {
  background: #F9F9F9;
  padding: 25px;
  margin: 150px 0;
  box-shadow: 0 0 20px 0 rgba(0, 0, 0, 0.2), 0 5px 5px 0 rgba(0, 0, 0, 0.24);
}

#surveyForm h3 {
  display: block;
  font-size: 30px;
  font-weight: 300;
  margin-bottom: 10px;
  margin-block-start: 0;
  margin-block-end: 0;
}

#surveyForm h4 {
  margin: 5px 0 15px;
  display: block;
  font-size: 13px;
  font-weight: 400;
}

fieldset {
  border: medium none !important;
  margin: 0 0 10px;
  min-width: 100%;
  padding: 0;
  width: 100%;
}

#surveyForm input[type="text"],
#surveyForm input[type="email"],
#surveyForm input[type="tel"],
#surveyForm input[type="url"],
#surveyForm textarea {
  width: 100%;
  border: 1px solid #ccc;
  background: #FFF;
  margin: 0 0 5px;
  padding: 10px;
}

#surveyForm input[type="text"],
#surveyForm input[type="email"],
#surveyForm input[type="tel"],
#surveyForm input[type="url"],
#surveyForm textarea {
  width: 100%;
  border: 1px solid #ccc;
  background: #FFF;
  margin: 0 0 5px;
  padding: 10px;
  margin-bottom: 20px;
}

#surveyForm input[type="text"]:hover,
#surveyForm input[type="email"]:hover,
#surveyForm input[type="tel"]:hover,
#surveyForm input[type="url"]:hover,
#surveyForm textarea:hover {
  -webkit-transition: border-color 0.3s ease-in-out;
  -moz-transition: border-color 0.3s ease-in-out;
  transition: border-color 0.3s ease-in-out;
  border: 1px solid #aaa;
}

#surveyForm textarea {
  height: 100px;
  max-width: 100%;
  resize: none;
}

#surveyForm button[type="submit"] {
  cursor: pointer;
  width: 100%;
  border: none;
  background-color: $primary !important;
  color: #FFF;
  margin: 0 0 5px;
  padding: 10px;
  font-size: 15px;
}

button {
    background-color: $primary !important;
    color: white;
    cursor: pointer;
}

button:hover {
   background-color: $accent !important;

  -webkit-transition: background 0.3s ease-in-out;
  -moz-transition: background 0.3s ease-in-out;
  transition: background-color 0.3s ease-in-out;

}

#surveyForm button[type="submit"]:hover {
background-color: $accent !important;
  -webkit-transition: background 0.3s ease-in-out;

  -moz-transition: background 0.3s ease-in-out;
  transition: background-color 0.3s ease-in-out;
}

#surveyForm button[type="submit"]:active {
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.5);
}

.copyright {
  text-align: center;
}

#surveyForm input:focus,
#surveyForm textarea:focus {
  outline: 0;
  border: 1px solid $primary;
}

::-webkit-input-placeholder {
  color: #888;
}

:-moz-placeholder {
  color: #888;
}

::-moz-placeholder {
  color: #888;
}

:-ms-input-placeholder {
  color: #888;
}

.invalid {
  border: solid 1px red !important;
}

</style>