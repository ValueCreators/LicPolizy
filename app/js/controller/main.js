var html = '';
var policyListResponse = null;
var disabledDAB = false;

$(document).one('pagebeforecreate', function () {
	var panel = $("#moreOptionsPanel");
	$.mobile.pageContainer.prepend(panel[0]);
	$("#moreOptionsPanel").panel();
});

$(document).ready(function() { 

	$('#select-plan').on('change', function(e) { 
		
		var selectedValue = $('#select-plan').val();
		var data = _.where(policyListResponse, {PrdId: parseInt(selectedValue)});

		if (!_.isEmpty(data)) {

			var planDetails = data[0].PrdTermList.split(",");
			var html = '<option value="select">--- select term ---</option>';
			_.each(planDetails, function(element, index, list){

      			html += '<option value="'+element+'">'+element+'</option>';
    		});
    		if (data[0].PrdDAB_YN == "N") {
    			$('.inc-dab')[0].disabled = true;
    			disabledDAB = true;
    		} else {
    			$('.inc-dab')[0].disabled = false;
    			disabledDAB = false;
    		}
    		$('#terms-list').html(html);
    		$("#terms-list [value='select']").attr("selected","selected");
    		$('#terms-list-button > span')[0].innerText = "--- select term ---";
    		//var opt = $("option[val='select']");
			//opt.attr('selected','selected');​​
    		//$("#terms-list").val("--- select term ---");
		}
	});

	$('#getPremiumData').on('click', function(e) {
		getMaturityData();
	});

});



function getPoliciesList() {
	loadPolicyMenuDOM();
	var policyListServiceUrl = "http://webservice.licpolizy.com/PolicyService.aspx?Prd=0";
	makeRequest(policyListServiceUrl, getPolicyListSuccess);
}

function getPolicyListSuccess(response_obj) {
	policyListResponse = JSON.parse( response_obj );
	var html = "";
	_.each(policyListResponse, function(element, index, list){
      html += '<option value="'+element.PrdId+'">'+element.PrdName+'</option>';
    });

	$('#select-plan').append(html);
}

function makeRequest(url, successCallback) {

	var _this = this;
	$.ajax({

		url : url,
		type : 'GET',
		success : function(response_obj, textStatus, jqXHR) {

			console.log("Request succeeded..");
			successCallback.apply(_this, [response_obj]);
		},

		error : function(json_data, textStatus, jqXHR) {

			console.log("Request failed..",json_data);
		}
	});
}


function loadPolicyMenuDOM() {
	
	if(appData.hasOwnProperty("licPolicy")) {
		
		var policyNames = Object.keys(appData["licPolicy"]);
		
		var policyNamesListDOM = '';
		
		if(policyNames && policyNames.length > 0) {
			
			for(var i=0; i<policyNames.length; i++) {
				policyNamesListDOM += '<li class="ui-li-static ui-body-inherit"><a href="#'+policyNames[i]+'" data-transition="none">'+policyNames[i]+'</a></li>';
				
				if(appData["licPolicy"].hasOwnProperty(policyNames[i])) {
					var descriptionData = appData["licPolicy"][policyNames[i]];
					
					var objectKeys = Object.keys(descriptionData);
					var descLength = objectKeys.length;
					
					var pageContent = "";
					
					for(var key in objectKeys) {
						pageContent += "<div data-role='fieldcontain' class='ui-field-contain'>"+descriptionData[objectKeys[key]]+"</div>";
					}
					
				}
				
				html += '<div data-role="page" data-transition="slide" id="'+policyNames[i]+'">'+
							'<div data-role="header" class="des-logo-cls">'+
								'<div>'+
      								'<a href="#maturityCalculatorPage" data-transition="slide" class="home-btn-icon ui-btn ui-icon-home ui-btn-icon-left"></a>'+
							    '</div>'+
								//'<div><a href="#maturityCalculatorPage" class="ui-btn ui-btn-left ui-icon-home ui-btn-icon-center"></a></div>'+
								'<div><a href="#moreOptionsPanel" class="list-btn-Cls ui-btn ui-btn-right ui-icon-bars ui-btn-icon-center"></a></div>'+
							'</div>'+
							'<div data-role="main" class="ui-content content" id="'+policyNames[i]+'_PageContent">'+
								'<div data-role="header">'+
									'<h3 class="margin0 des-h-cls">'+policyNames[i]+'</h3>'+
								'</div>'+
								pageContent+
							'</div>'+
						'</div>';
				
			}
		}
		
		$("#moreOptionsList").html(policyNamesListDOM);
		
		$( document.body ).append(html);
	}
}

function getMaturityData(sendMail) {

	var plan = parseInt( $('#select-plan').val() );
	var term = parseInt( $('#terms-list').val() );
	var sumAssured =  parseInt($('#lifecover').val());
	var dob = $('#date_val').val();
	var name = $('#name').val();
	var mailID = $('#mailId').val();
	$('.error-msg').addClass('none');
	var doubleAccBenifit = "Y";
	if (disabledDAB) {
		doubleAccBenifit = "N";
	} else {
		doubleAccBenifit = $('.inc-dab')[0].checked ? "Y" : "N";
	}
	var errorMessage = validateForm(sendMail);
	if (!errorMessage) {
		$('.error-msg').addClass('none');

		var requestURL = null;

		if (!sendMail) {
			requestURL = "http://webservice.licpolizy.com/PolicyService.aspx?Premium=<NewDataSet><MainDetl>"+
								"<DDLPlan>"+plan+"</DDLPlan><DDLTerm>"+term+"</DDLTerm><TxtSumAssured>"+sumAssured+"</TxtSumAssured>"+
								"<DOB>"+dob+"</DOB><DAB>"+doubleAccBenifit+"</DAB></MainDetl></NewDataSet>";
		} else {
			requestURL = "http://webservice.licpolizy.com/PolicyService.aspx?SendMailQuotes=<NewDataSet><MainDetl>"+
								"<DDLPlan>"+plan+"</DDLPlan><DDLTerm>"+term+"</DDLTerm><TxtSumAssured>"+sumAssured+"</TxtSumAssured>"+
								"<DOB>"+dob+"</DOB><DAB>"+doubleAccBenifit+"</DAB><Name>"+name+"</Name><MailID>"+mailID+"</MailID></MainDetl></NewDataSet></MainDetl></NewDataSet>";
		}
		$.ajax({

			url : requestURL,
			type : 'GET',
			success : function(response_obj, textStatus, jqXHR) {
				if (response_obj) {
					var data = JSON.parse(response_obj)
					$('.show-maturity-details .md-data')[0].innerHTML = "";
					$('.show-maturity-details .md-data').append(data[0].Premium);
					$('.show-maturity-details').removeClass('none');
				} else {
					alert('Successfully send !!!');
				}
			},

			error : function(json_data, textStatus, jqXHR) {

				console.log("Request failed..",json_data);
			}
		});
	} else {
		$('.error-msg')[0].innerHTML = errorMessage;
		$('.error-msg').removeClass('none');
	}
}

function validateForm (sendMail) {

	var errorMessage = false;
	var dob = $('#date_val').val();
	if (!parseInt($('#lifecover').val())) {
		errorMessage = "Please enter valid sumAssured" ; 
	} else if (!parseInt( $('#select-plan').val() )) {
		errorMessage = "Please select plan" ; 
	} else if (!parseInt( $('#terms-list').val()) ) {
		errorMessage = "Please select terms" ; 
	} else if (dob === 'null' || dob == undefined || !dob) {
		errorMessage = "Please enter date of birth" ; 
	}

	if(sendMail) {
		var mailId = $('#mailId').val();
		if ( mailId === 'null' || mailId == undefined || !mailId || !validateEmail(mailId)) {
			errorMessage = "Please enter valid mailId" ;
		}
	}

	return errorMessage;
}


function validateEmail(email) { 
  // http://stackoverflow.com/a/46181/11236
  
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

/* 

   New Jeevan Ananad is not working if i give above the date 8.14.1997
*/




