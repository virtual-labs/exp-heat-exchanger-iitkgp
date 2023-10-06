
let simParams = {
  

  title : 'Heat Exchanger', 

  labType : 'Dynamic',

  runButtonID : "button_runButton", 
 
  runLoggerURL : "../webAppRunLog.lc",
  runCurrrentRunCountURL : "../webAppCurrentCount.lc",


  simStepRepeats : 1, 
  simTimeStep : 2, 

  updateDisplayTimingMs : 50, 

  updateRunCount : function() {
  
    $.post(this.runLoggerURL,{webAppNumber: "6, Heat Exchanger"})
      .done(
        function(data) {
          
        } 
      ) 
  },

  updateCurrentRunCountDisplay : function() {
   
  },

}; 
