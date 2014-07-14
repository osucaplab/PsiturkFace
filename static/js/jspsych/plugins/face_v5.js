/**
 * Face ERP Experiment for the OSU Caplab
 * Code by Cody Cooper
 *
 * Based on work by:
 * Josh de Leeuw
 * November 2013
 * 
 * This is a basic template for a jsPsych plugin. Use it to start creating your
 * own plugin. There is more information about how to create a plugin on the
 * jsPsych wiki (https://github.com/jodeleeuw/jsPsych/wiki/Create-a-Plugin).
 * 
 * 
 */
(function( $ ) {
	jsPsych["face-exp"] = (function(){
		var plugin = {};
		plugin.create = function(params) {
			var trials = new Array(68/*params.attributes.length*/);
			for(var i = 0; i < 68/*params.attributes.length*/; i++)
			{
				trials[i] = {};
				trials[i].type = "face-exp";
				trials[i].img = params.stimuli[i][0];
				trials[i].shape = params.attributes[i][0];
				trials[i].trialtype=params.attributes[i][3];//Alpha: CD XD or D
				trials[i].group=params.attributes[i][1];//Alpha of Adok or Lork
				if(params.attributes[i][1]== "Adok"){
					trials[i].nat  = 65;
                } 
				else if(params.attributes[i][1]== "Lork"){
					trials[i].nat  = 76;
				}
				if(params.attributes[i][2]== "Fr"){
					trials[i].disp  = 65;
                } 
				else if(params.attributes[i][2]== "Ag"){
					trials[i].disp  = 76;
				}
                trials[i].prompt1 = (typeof params.prompt1 === 'undefined') ? "Please specify a value for prompt1 in the block parameters" : params.prompt1;
				trials[i].prompt2 = (typeof params.prompt2 === 'undefined') ? "Please specify a value for prompt2 in the block parameters" : params.prompt2;
				trials[i].prompt3 = (typeof params.prompt3 === 'undefined') ? "Please specify a value for prompt3 in the block parameters" : params.prompt3;
				trials[i].rest = (typeof params.rest === 'undefined') ? 'Please take a moment to take a short break. Press enter when you are ready to continue.': params.rest;
				trials[i].left_key = params.left_key || 65; // defaults to the 'A' key
                trials[i].right_key = params.right_key || 76; // defaults to the 'L' key
				trials[i].fixation= (typeof params.fixation === 'undefined') ? "+" : params.fixation;
				
				
                
                // supporting the generic data object with the following line
                // is always a good idea. it allows people to pass in the data
                // parameter, but if they don't it gracefully adds an empty object
                // in it's place.
                trials[i].data = (typeof params.data === 'undefined') ? {} : params.data[i];
			}	
			return trials;
		};
		//var tcomplete=false;
		var rtc=-1;
		var resp_c =-1;
		var rtd=-1;
		var resp_d =-1;
		var n = 1;
		plugin.trial = function(display_element, block, trial, part) {
		
			switch (part){	
				case 1://start trial with a fixation screen
					rtc=999;
					resp_c =999;
					rtd=999;
					resp_d =999;
					display_element.append($('<div>', {
                        "class": 'face-study-stimulus',
                        html: trial.fixation
                    }));
					$('.face-study-stimulus').css({
											'font-size' : '4em',
											top :'40%',
											left:'50%',
											position:'fixed'
												});
				// start a timer of length trial.timing_x to move to the next part of the trial
                setTimeout(function() {
                    plugin.trial(display_element, block, trial, part + 1);
                }, 1000);
                break;
				case 2://remove the fixation image
					$('.face-study-stimulus').remove();
					// start timer
					setTimeout(function() {
						plugin.trial(display_element, block, trial, part + 1);
					}, 250);
				break;
//********************************************show the face******************************************************************
				case 3:
					display_element.append($('<img>', {
						src: trial.img,
						"class": 'face-study-stimulus'
					}));
					$('.face-study-stimulus').css({//sets the display elements of the first prompt should be approximately in the middle of screen
												width:'auto',
												height:'75%',
												left:'32%',
												position:'fixed'
											});
					setTimeout(function() {
						plugin.trial(display_element, block, trial, part+1);
						}, 2000);
				break;
//******************************************************************************************************************
				case 4://remove the face image
					$('.face-study-stimulus').remove();
					// start timer
					setTimeout(function() {
						plugin.trial(display_element, block, trial, part + 1);
					}, 250);
				break;
//********************************************************************************************************************
				case 5://display the fixation
					display_element.append($('<div>', {
                        "class": 'face-study-stimulus',
                        html: trial.fixation
                    }));
					$('.face-study-stimulus').css({
											'font-size' : '4em',
											top :'40%',
											left:'50%',
											position:'fixed'
												});
				// start a timer of length trial.timing_x to move to the next part of the trial
                setTimeout(function() {
                    plugin.trial(display_element, block, trial, part + 1);
                }, 1000);
                break;
//*********************************************************************************************************************************
				case 6://remove the fixation image
					$('.face-study-stimulus').remove();
					// start timer
					setTimeout(function() {
						plugin.trial(display_element, block, trial, part + 1);
					}, 250);
				break;				
//************************************* Show Categorization Question ****************************************************************
				case 7:
					if(trial.trialtype=='CD'){
						// show prompt1 for CD
						if (trial.prompt1 !== "") {
							display_element.append($('<div>', {
							"class": 'face-study-stimulus',
							html: trial.prompt1
							
						}));
							$('.face-study-stimulus').css({//sets the display elements of the first prompt should be approximately in the middle of screen
													'font-size' : '2em',
													top : '40%',
													left: '28%',
													'text-align':'center',
													position:'fixed'
												});
						}

						// start measuring response time
						var startTime = (new Date()).getTime();

						// create the function that triggers when a key is pressed.
						var flag1 = false; // true when a valid key is chosen
						var resp_func1 = function(e1) {
							//var correct1 = false; // true when the correct response is chosen
							if (e1.which == trial.left_key) // 'q' key by default
							{
								flag1 = true;//can use this for feedback set a correct == to the assignment
								resp_c=e1.which;
							}
							else if (e1.which == trial.right_key) // 'p' key by default
							{
								flag1 = true;
								resp_c=e1.which;
							}
							
							if (flag1) {
								var endTime = (new Date()).getTime();
								rtc = (endTime - startTime);
								clearTimeout(cat_timer);//cancel the timeout event at the end of this case
								$(document).unbind('keydown', resp_func1); // remove response function from keys
								plugin.trial(display_element, block, trial, part + 1);							
							}
						};
							$(document).keydown(resp_func1);
							cat_timer = setTimeout(function() {//acts as trial timer
								$(document).unbind('keydown', resp_func1);
								rtc=999;
								resp_c=999;//
								plugin.trial(display_element, block, trial, part + 1);
							}, 5000);
							
					}
					else if(trial.trialtype=='XD'){//XD**************************************************************************************************************************************
						// show prompt3 for XD
						if (trial.prompt3 !== "") {
							display_element.append($('<div>', {
							"class": 'face-study-stimulus',
							html: trial.prompt3 + trial.group + "."
						}));
							$('.face-study-stimulus').css({//sets the display elements of the first prompt should be approximately in the middle of screen
													'font-size' : '2em',
													top : '40%',
													left: '28%',
													'text-align':'center',
													position:'fixed'
												});
						}

						// start measuring response time
						var startTime = (new Date()).getTime();
							setTimeout(function() {//acts as trial timer
								rtc=999;
								resp_c=startTime-((new Date()).getTime());//
								plugin.trial(display_element, block, trial, part + 1);
							}, 5000);	
					}
					else if(trial.trialtype=='D'){// D only
					plugin.trial(display_element, block, trial, part + 4); // skip to decision question
					}
				break;
//*******************************************************************************************************************************
				case 8://remove prompt1 
					$('.face-study-stimulus').remove();
					// start timer
					setTimeout(function() {
						plugin.trial(display_element, block, trial, part + 1);
					}, 250);
				break;
//*************************** Show fixation after Prompt1 ***********************************************************************
				case 9:
					display_element.append($('<div>', {
                        "class": 'face-study-stimulus',
                        html: trial.fixation
                    }));
					$('.face-study-stimulus').css({
											'font-size' : '4em',
											top : '40%',
											left:'50%',
											position:'fixed'
											});
				// start a timer of length trial.timing_x to move to the next part of the trial
					setTimeout(function() {
						plugin.trial(display_element, block, trial, part + 1);
					}, 1000);// need to fix
                break;
//*************************************************************************************************************************
				case 10://remove the fixation image
					$('.face-study-stimulus').remove();
					// start timer
					setTimeout(function() {
						plugin.trial(display_element, block, trial, part + 1);
					}, 250);
				break;
//************************ Show prompt2 ***********************************************************************************
				case 11:
					// show prompt2
					if (trial.prompt2 !== "") {
						display_element.append($('<div>', {
                        "class": 'face-study-stimulus',
                        html: trial.prompt2
                    }));
						$('.face-study-stimulus').css({//sets the display elements of the first prompt should be approximately in the middle of screen
							'font-size' : '2em',
							top : '40%',
							left: '25%',
							'text-align':'center',
							position:'fixed'
						});
					}

					// start measuring response time
					var startTime2 = (new Date()).getTime();

					// create the function that triggers when a key is pressed.
					var resp_func2 = function(e2) {
						var flag2 = false; // true when a valid key is chosen
						//var correct2 = false; // true when the correct response is chosen
						if (e2.which == trial.left_key) // 'q' key by default
						{
							flag2 = true;//can use this for feedback set a correct == to the assignment
							resp_d=e2.which;
						}
						else if (e2.which == trial.right_key) // 'p' key by default
						{
							flag2 = true;
							resp_d=e2.which;
						}
						if (flag2) {
							var endTime2 = (new Date()).getTime();
							rtd = (endTime2 - startTime2);
							// create object to store data from trial
							$(document).unbind('keydown', resp_func2); // remove response function from keys
							clearTimeout(dec_timer);
							plugin.trial(display_element, block, trial, part + 1);
							//tcomplete = true;
						}
					};
						$(document).keydown(resp_func2);
						dec_timer = setTimeout(function() {//acts as trial timer
							plugin.trial(display_element, block, trial, part + 1);
							$(document).unbind('keydown', resp_func2);
							rtd=999;
							resp_d=999;//
							}, 5000);
				break;
//******************************************************************************************************************
				case 12://remove prompt2
					$('.face-study-stimulus').remove();
					// start timer
					setTimeout(function() {
						plugin.trial(display_element, block, trial, part + 1);
					}, 250);
				break;
//*************************** Show fixation after Prompt2 ***********************************************************************
				case 13:
					display_element.append($('<div>', {
                        "class": 'face-study-stimulus',
                        html: trial.fixation
                    }));
					$('.face-study-stimulus').css({
						'font-size' : '4em',
						top : '40%',
						left:'50%',
						position:'fixed'
						});
				// start a timer of length trial.timing_x to move to the next part of the trial
					setTimeout(function() {
						plugin.trial(display_element, block, trial, part + 1);
					}, 1000);// need to fix
                break;
//********************************************************************************************************************************
				case 14://remove the fixation image
					$('.face-study-stimulus').remove();
					// start timer
					setTimeout(function() {
						plugin.trial(display_element, block, trial, part + 1);
					}, 250);
				break;
//************************************************** Show Feedback ****************************************************************
				case 15 ://show feedback; a lot of simple if else statements
					if(trial.trialtype=='CD'){	
					if(resp_c==trial.nat && resp_d==trial.disp){	
						if(resp_c==65 && resp_d==65){
							display_element.append($('<img>', {
								src: "/static/img/AcFc.BMP",
								"class": 'face-study-stimulus'
							}));
						} 
						else if(resp_c==65 && resp_d==76){
							display_element.append($('<img>', {
								src: "/static/img/AcDc.BMP",
								"class": 'face-study-stimulus'
							}));
						} 
						else if(resp_c==76 && resp_d==65){
							display_element.append($('<img>', {
								src: "/static/img/LcFc.BMP",
								"class": 'face-study-stimulus'
							}));
						} 
						else if(resp_c==76 && resp_d==76){
							display_element.append($('<img>', {
								src: "/static/img/LcDc.BMP",
								"class": 'face-study-stimulus'
							}));
						}
					}
					else if(resp_c!=trial.natCD && resp_d==trial.dispCD){//incorrect categorization***********************************
						if(resp_c==65 && resp_d==65){
							display_element.append($('<img>', {
								src: "/static/img/AwFc.BMP",
								"class": 'face-study-stimulus'
							}));
						} 
						else if(resp_c==65 && resp_d==76){
							display_element.append($('<img>', {
								src: "/static/img/AwDc.BMP",
								"class": 'face-study-stimulus'
							}));
						} 
						else if(resp_c==76 && resp_d==65){
							display_element.append($('<img>', {
								src: "/static/img/LwFc.BMP",
								"class": 'face-study-stimulus'
							}));
						} 
						else if(resp_c==76 && resp_d==76){
							display_element.append($('<img>', {
								src: "/static/img/LwDc.BMP",
								"class": 'face-study-stimulus'
							}));
						}
					}
					else if(resp_c==trial.natCD && resp_d!=trial.dispCD){//incorrect decision***********************
						if(resp_c==65 && resp_d==65){
							display_element.append($('<img>', {
								src: "/static/img/AcFw.BMP",
								"class": 'face-study-stimulus'
							}));
						} 
						else if(resp_c==65 && resp_d==76){
							display_element.append($('<img>', {
								src: "/static/img/AcDw.BMP",
								"class": 'face-study-stimulus'
							}));
						} 
						else if(resp_c==76 && resp_d==65){
							display_element.append($('<img>', {
								src: "/static/img/LcFw.BMP",
								"class": 'face-study-stimulus'
							}));
						} 
						else if(resp_c==76 && resp_d==76){
							display_element.append($('<img>', {
								src: "/static/img/LcDw.BMP",
								"class": 'face-study-stimulus'
							}));
						}
					}
					else if(resp_c!=trial.natCD && resp_d!=trial.dispCD){//incorrect decision and categorization***********************
						if(resp_c==65 && resp_d==65){
							display_element.append($('<img>', {
							src: "/static/img/AwFw.BMP",
							"class": 'face-study-stimulus'
							}));
						} 
						else if(resp_c==65 && resp_d==76){
							display_element.append($('<img>', {
								src: "/static/img/AwDw.BMP",
								"class": 'face-study-stimulus'
							}));
						} 
						else if(resp_c==76 && resp_d==65){
							display_element.append($('<img>', {
								src: "/static/img/LwFw.BMP",
								"class": 'face-study-stimulus'
							}));
						} 
						else if(resp_c==76 && resp_d==76){
							display_element.append($('<img>', {
								src: "/static/img/LwDw.BMP",
								"class": 'face-study-stimulus'
							}));
						}
						else if(resp_c==999 || resp_d==999){
							display_element.append($('<img>', {
								src: "/static/img/sorry.BMP",
								"class": 'face-study-stimulus'
							}));
						}
					}
				}
				else if(trial.trialtype=='XD'||trial.trialtype=='D'){
					if(trial.nat==65/*adok*/ && resp_d==trial.dispCD/*correct answer*/ && resp_d==65/*friendly*/){
						display_element.append($('<img>', {
							src: "/static/img/AFc.BMP",
							"class": 'face-study-stimulus'
						}));
					
					}
					else if(trial.nat==65/*adok*/ && resp_d==trial.dispCD/*correct answer*/ && resp_d==76/*Defensive*/){
						display_element.append($('<img>', {
							src: "/static/img/ADc.BMP",
							"class": 'face-study-stimulus'
						}));
					
					}
					else if(trial.nat==76/*lork*/ && resp_d==trial.dispCD/*correct answer*/ && resp_d==65/*friendly*/){
						display_element.append($('<img>', {
							src: "/static/img/LFc.BMP",
							"class": 'face-study-stimulus'
						}));
					
					}
					else if(trial.nat==76/*lork*/ && resp_d==trial.dispCD/*correct answer*/ && resp_d==76/*Defensive*/){
						display_element.append($('<img>', {
							src: "/static/img/LDc.BMP",
							"class": 'face-study-stimulus'
						}));
					
					}
//******************************************************************************************************************************************
					else if(trial.nat==65/*adok*/ && resp_d!=trial.dispCD/*incorrect answer*/ && resp_d==65/*friendly*/){
						display_element.append($('<img>', {
							src: "/static/img/AFw.BMP",
							"class": 'face-study-stimulus'
						}));
					
					}
					else if(trial.nat==65/*adok*/ && resp_d!=trial.dispCD/*incorrect answer*/ && resp_d==76/*Defensive*/){
						display_element.append($('<img>', {
							src: "/static/img/ADw.BMP",
							"class": 'face-study-stimulus'
						}));
					
					}
					else if(trial.nat==76/*lork*/ && resp_d!=trial.dispCD/*incorrect answer*/ && resp_d==65/*friendly*/){
						display_element.append($('<img>', {
							src: "/static/img/LFw.BMP",
							"class": 'face-study-stimulus'
						}));
					
					}
					else if(trial.nat==76/*lork*/ && resp_d!=trial.dispCD/*incorrect answer*/ && resp_d==76/*Defensive*/){
						display_element.append($('<img>', {
							src: "/static/img/LDw.BMP",
							"class": 'face-study-stimulus'
						}));
					}
					else if(resp_d==999){
						display_element.append($('<img>', {
							src: "/static/img/sorry.BMP",
							"class": 'face-study-stimulus'
						}));
					}
				
				}
				$('.face-study-stimulus').css({//sets the display elements of the first prompt should be approximately in the middle of screen
					width:'auto',
					height:'100%',
					left:'22%',
					top:'0%',
					position:'fixed'
				});

				var feedback = display_element.src;	
				
				setTimeout(function() {
					plugin.trial(display_element, block, trial, part+1);
					}, 4000);
				break;
//********************************** take a break *************************************************************************************
				case 16:
					if(n==4){//after 34 cd trials take a break
					$('.face-study-stimulus').remove();
					var start_break=(new Date()).getTime();
					//display the break
							display_element.append($('<div>', {
								"class": 'face-study-stimulus',
								html: trial.rest
							}));
							$('.face-study-stimulus').css({
								'font-size' : '2em',
								top :'40%',
								left:'50%',
								position:'fixed'
							});
						var resp_func3 = function(e3) {
							var flag3 = false; // true when a valid key is chosen
							//var correct2 = false; // true when the correct response is chosen
							if (e3.which == 13){ // if they hit enter
								flag3=true;
							}
							if(flag3){
								var endTime3 = (new Date()).getTime();
								rtbreak = (endTime3 - start_break);
								$(document).unbind('keydown', resp_func3); // remove response function from keys
								plugin.trial(display_element, block, trial, part + 1);
								//tcomplete = true;
							}
						};
						$(document).keydown(resp_func3);
					}
					else{
					plugin.trial(display_element, block, trial, part + 1);
					}
				break;
				
//****************************************Remove Feedback and write trial data*****************************************************************************************
				case 17:
					$('.face-study-stimulus').remove();//set time out function for the blank screen then block.next();
					var trial_data = {
								"trial_type": "face-exp",
								trial_index: block.trial_idx,
								"rt_cat": rtc,
								"rt_dec":rtd,
								"stimulus": trial.img,
								"cat.resp":resp_c,
								"cat.Assign":trial.nat,
								"dec.resp":resp_d,
								"disp.Assign":trial.disp,
								"face_shape":trial.shape,
								"Feedback":feedback
							};
							block.writeData($.extend({}, trial_data, trial.data));
					setTimeout(function() {n+=1;block.next();}, 1000);
            }// End switch function
        };
        return plugin;
    })();
})(jQuery);
