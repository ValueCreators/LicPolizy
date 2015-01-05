var html = '';

$(document).one('pagebeforecreate', function () {
	var panel = $("#moreOptionsPanel");
	$.mobile.pageContainer.prepend(panel[0]);
	$("#moreOptionsPanel").panel();
	
	//$("#moreOptionsList").listview('refresh');
});

/*$(document).on('pageshow', '#maturityCalculatorPage', function () {
	
	$("#moreOptionsList").listview('refresh');
});*/

function getPoliciesList() {

	console.log("getPoliciesList  --->>>>>>>");



	var policyListServiceUrl = "http://webservice.licpolizy.com/PolicyService.aspx?Prd=0";

	makeRequest(policyListServiceUrl, getPolicyListSuccess, getPolicyListFailure);
}

function getPolicyListSuccess(response_obj) {

	console.log('response_obj......',response_obj)
}

function getPolicyListFailure() {

	alert("Failure");
}

function makeRequest(url, successCallback, errorCallback) {

	var _this = this;
	$.ajax({

		url : url,
		type : 'GET',
		//dataType : 'json',
		success : function(response_obj, textStatus, jqXHR) {

			console.log("Request succeeded..");

			successCallback.apply(_this, [response_obj]);
		},

		error : function(json_data, textStatus, jqXHR) {

			console.log("Request failed..",json_data);

			errorCallback.apply(_this, [json_data]);
		}
	});
}


function loadPolicyMenuDOM() {
	
	//console.log(">>>>>>>>>>>>> loadPolicyMenuDOM");

	getPoliciesList();
	
	if(appData.hasOwnProperty("licPolicy")) {
		
		var policyNames = Object.keys(appData["licPolicy"]);
		
		//console.log("PolicyNames >>>>>>>>> "+policyNames);
		
		var policyNamesListDOM = '';
		
		if(policyNames && policyNames.length > 0) {
			
			for(var i=0; i<policyNames.length; i++) {
				policyNamesListDOM += '<li class="ui-li-static ui-body-inherit"><a href="#'+policyNames[i]+'" data-transition="none">'+policyNames[i]+'</a></li>';
				
				if(appData["licPolicy"].hasOwnProperty(policyNames[i])) {
					var descriptionData = appData["licPolicy"][policyNames[i]];
					
					var objectKeys = Object.keys(descriptionData);
					var descLength = objectKeys.length;
					//console.log("descLength >> "+descLength);
					
					var pageContent = "";
					
					for(var key in objectKeys) {
						//console.log("Key >> "+objectKeys[key]);
						//console.log("Value >> "+descriptionData[objectKeys[key]]);
						pageContent += "<div data-role='fieldcontain' class='ui-field-contain'>"+descriptionData[objectKeys[key]]+"</div>";
					}
					
					//console.log("pageContent >> "+pageContent);
					//$("#"+pageId+"_PageContent").html(pageContent);
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
		//policyNamesListDOM += '</ul>';
		
		$("#moreOptionsList").html(policyNamesListDOM);
		
		$( document.body ).append(html);
	}
}