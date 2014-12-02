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

function loadPolicyMenuDOM() {
	
	console.log(">>>>>>>>>>>>> loadPolicyMenuDOM");
	
	if(appData.hasOwnProperty("licPolicy")) {
		
		var policyNames = Object.keys(appData["licPolicy"]);
		
		console.log("PolicyNames >>>>>>>>> "+policyNames);
		
		var policyNamesListDOM = '';
		
		if(policyNames && policyNames.length > 0) {
			
			for(var i=0; i<policyNames.length; i++) {
				policyNamesListDOM += '<li class="ui-li-static ui-body-inherit"><a href="#'+policyNames[i]+'" data-transition="none">'+policyNames[i]+'</a></li>';
				
				if(appData["licPolicy"].hasOwnProperty(policyNames[i])) {
					var descriptionData = appData["licPolicy"][policyNames[i]];
					
					var objectKeys = Object.keys(descriptionData);
					var descLength = objectKeys.length;
					console.log("descLength >> "+descLength);
					
					var pageContent = "";
					
					for(var key in objectKeys) {
						console.log("Key >> "+objectKeys[key]);
						console.log("Value >> "+descriptionData[objectKeys[key]]);
						pageContent += "<div data-role='fieldcontain' class='ui-field-contain'>"+descriptionData[objectKeys[key]]+"</div>";
					}
					
					console.log("pageContent >> "+pageContent);
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
									'<h3 class="des-h-cls">'+policyNames[i]+'</h3>'+
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