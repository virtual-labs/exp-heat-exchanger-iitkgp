

let controller = {

 
  simTime : 0, 
  oldSimTime : 0, 

 
  ssFlag : false,
  
  ssStartTime : 0,
  stripPlotSpan : 5000,

  openThisLab : function() {

    
    for (let u in processUnits) {
      processUnits[u].initialize();
    }

   
    plotInfo.initialize();
   
    plotter.plotArrays.initialize();
    interfacer.resetThisLab(); 
    simParams.updateCurrentRunCountDisplay(); 

  }, 

  updateProcess : function() {
   
    let startDate = new Date(); 
    let startMs = startDate.getTime();

   

    for (let i = 0; i < simParams.simStepRepeats; i++) {
      controller.updateProcessUnits();
    }

   
    let currentMs = controller.updateDisplay();


  }, 

  updateProcessUnits : function() {
   

    if (controller.ssFlag) {
     
      return;
    }

    let u; 

  
    for (u in processUnits) {
      processUnits[u].updateInputs();
    }

   
    for (u in processUnits) {
        processUnits[u].updateState();
    }

  }, 

  updateDisplay : function() {

    

    if (controller.ssFlag) {
     
      let thisDate = new Date();
      let thisMs = thisDate.getTime();
      return thisMs;
    }

   
    for (let u in processUnits) {
      processUnits[u].updateDisplay();
    }

    for (let p in plotInfo) {
      let ptype = plotInfo[p]['type'];
      if (ptype == 'canvas') {
        
        plotter.plotColorCanvasPlot(p);
        if (simParams.labType != 'Dynamic') {
          
          let numSatReps = 5; 
          for (let k = 0; k < numSatReps; k++) {
            plotter.plotColorCanvasPlot(p);
          }
        }
      } else if ((ptype == 'profile') || (ptype == 'strip') || (ptype == 'single')) {
        
        let data = plotter.getPlotData(p);
        plotter.plotPlotData(data,p);
      } else {
        
      }
    } 
    controller.checkForSteadyState();

  
    let thisDate = new Date();
    let thisMs = thisDate.getTime();
    return thisMs;

  },  

  resetSimTime : function() {
   
    controller.simTime = 0;
    controller.resetSSflagsFalse();
  },

  updateSimTime : function() {
   
    controller.simTime = controller.simTime + simParams.simTimeStep * simParams.simStepRepeats;
  },

  resetSSflagsFalse : function() {
    controller.ssStartTime = 0;
    controller.oldSimTime = 0;
    controller.ssFlag = false; 
    controller.stripPlotSpan = controller.getStripPlotSpan();
  },

  getStripPlotSpan : function() {
    let span = 0;
    for (let p in plotInfo) {
      if (plotInfo[p]['type'] == 'strip') {
        let xMax = plotInfo[p]['xAxisMax'] - plotInfo[p]['xAxisMin'];
        if (xMax > span) {span = xMax;}
      }
    }
    return span;
  },

  checkForSteadyState : function() {
   

    let u; 
    let resTime = 0;
    for (u in processUnits) {
      if (processUnits[u]['residenceTime'] > resTime) {
        resTime = processUnits[u]['residenceTime'];
      }
    }

   
    if (controller.simTime >= controller.oldSimTime + 2 * resTime) {

     
      let thisFlag = true; 
      let thisCheck = true;

      for (u in processUnits) {
        thisCheck = processUnits[u].checkForSteadyState();
        if (thisCheck == false){
        
          thisFlag = false;
        }
      }

      if (thisFlag == false) {
        controller.resetSSflagsFalse();
      } else {
       
        if (controller.stripPlotSpan == 0) {
          
          controller.ssFlag = true;
        } else {
          
          if (controller.ssStartTime == 0) {
           
            controller.ssStartTime = controller.simTime;
          } else {
           
            if ((controller.simTime - controller.ssStartTime) >= controller.stripPlotSpan) {
             
              controller.ssFlag = true;
            } else {
              
            }
          }
        }
      }

     
      controller.oldSimTime = controller.simTime;

    } else { 
      
    } 

  } 

}; 
