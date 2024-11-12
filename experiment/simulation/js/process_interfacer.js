
let interfacer = {
  

  timerID : 0, 

  runThisLab : function() {
    
    let el = document.getElementById('button_runButton');
    if (el.value == 'Run') {

      
      controller.resetSSflagsFalse(); 

      if (simParams.labType == 'Dynamic') {
        
        el.value = 'Pause'; 
       
        this.timerID = setInterval(controller.updateProcess,simParams.updateDisplayTimingMs);
      } else {
        
        controller.updateProcess();
      }

      simParams.updateRunCount();

    } else {
     
      clearInterval(this.timerID);
      el.value = 'Run'; 
    } 

  }, 

  resetThisLab : function() {
    
    clearInterval(this.timerID);
    controller.resetSimTime();
   
    for (let u in processUnits) {
      processUnits[u].reset();
    }
    controller.resetSSflagsFalse();
    controller.updateDisplay();
    let el = document.getElementById('button_runButton');
    el.value = 'Run';
   

    let txt = 'interactive '
      + 'simulations for interactive learning ';
    document.getElementById('div_rlnoticetext').innerHTML = txt;
    

  }, 

  getInputValue : function(u,v) {
   

    let varInputID = processUnits[u]['dataInputs'][v];
    let varDefault = processUnits[u]['dataDefault'][v];
    let varMin = processUnits[u]['dataMin'][v];
    let varMax = processUnits[u]['dataMax'][v];
    let varValue; // set below
   
    let qflag = false;
    if (processUnits[u]['dataQuizInputs']) {
     
      if (processUnits[u]['dataQuizInputs'][v]) {
       
        qflag = true;
        varValue = this.quizInputArray[u][v];
      }
    }
    if (qflag == false) {
      
      if (document.getElementById(varInputID)) {
        
        varValue = document.getElementById(varInputID).value;
        varValue = Number(varValue); 
        if (isNaN(varValue)) {varValue = varDefault;} 
        if (varValue < varMin) {varValue = varMin;}
        if (varValue > varMax) {varValue = varMax;}
       
        varValue = this.formatNumToNum(varValue);
      
        document.getElementById(varInputID).value = varValue;
       
        varValue = Number(varValue);
      } else {
       
        varValue = varDefault;
      }
    }
    return varValue;
  }, 

  updateUIparams : function() {
    
    for (let u in processUnits) {
      processUnits[u].updateUIparams();
    }
  }, 

  initializeQuizVars : function(u,qv) {
    
    let v;
    let vmin;
    let vmax;
    let qval;
    this.quizInputArray = initializeQuizArray();
    for (let n in qv) {
      v = qv[n];
      processUnits[u]['dataQuizInputs'][v] = true; 
      vmin = processUnits[u]['dataMin'][v];
      vmax = processUnits[u]['dataMax'][v];
      if (vmin < 0) {
        
        qval = randomLogNormal(vmin,vmax); 
      } else {
       
        qval = vmin + Math.random() * (vmax - vmin);
      }
      
      if (Math.abs(qval) >= 10){
        qval = Math.round(qval);
      } else if (Math.abs(qval) >= 1) {
        qval = qval.toFixed(1); 
        qval = Number(qval); 
      }
      this.quizInputArray[u][v] = qval;
    }

    function initializeQuizArray() {
      
      let arrayStub = [];
      for (let u in processUnits) {
        arrayStub[u] = [];
      }
      return arrayStub;
    } 

    function randomLogNormal(vmin,vmax) {
      
      let sigma = 0.5; 
      let mu = 0.5; 
      let u; let v; let x; let y;
      let zmax = 5;
      let z = 1 + zmax;
      
      while (z > zmax) {
        u = Math.random();
        v = Math.random();
       
        x = Math.sqrt( -2.0 * Math.log(u) ) * Math.cos(2.0 * Math.PI * v);
       
        y = x*sigma + mu;
        z = Math.exp(y);
      }
      
      return (z/zmax)*(vmax - vmin) + vmin;
    } 

  }, 

  checkQuizAnswer : function(u,v) {
   
    let txt;
    let varName = processUnits[u]['dataHeaders'][v];
    let inputFieldName = "input_field_" + varName;
    let varAnswer = prompt("Please enter value of " + varName + ": ");
    if (varAnswer == null || varAnswer == "") {
      txt = "User cancelled the prompt.";
    } else {
      varAnswer = Number(varAnswer);
      let varValue = this.quizInputArray[u][v];
      varValue = this.formatNumToNum(varValue);
      txt = "You entered: " + varAnswer + " correct is " + varValue;
      
      let absVarAnswer = Math.abs(varAnswer);
      let absVarValue = Math.abs(varValue);
      if ((absVarAnswer >= 0.8 * absVarValue) && (absVarAnswer <= 1.2 * absVarValue)){
        alert("Good work! " + txt);
        
        let el = document.getElementById(processUnits[u]['dataInputs'][v]);
        el.value = varValue;
        
        let bname = "button_quiz_" + varName;
        document.getElementById(bname).style.visibility = "hidden";
        
        processUnits[u]['dataQuizInputs'][v] = 'answered';
        
        processUnits[u]['dataValues'][v] = varValue;
      } else {
        alert(varAnswer + " not within +/- 20%. Try again.");
      }
    }
  }, 

  copyData : function(plotIndex) {
   
    if (simParams.oldDataFlag == 1) {
      return;
    }

    
    let el = document.getElementById('button_runButton');
    if (el.value == 'Pause') {
      
      interfacer.runThisLab(); 
    }

    let u; 
    let v; 
    let p;
    let numUnits;
    let numVar;
    let varValue;
    let varIndex; 
    let varUnitIndex; 
    let tText; 
    let tItemDelimiter = ', &nbsp;';
    let tVarLen = plotInfo[plotIndex]['var'].length; 

    tText = '<p>Simulation' + simParams.title + '</p>';

   

    let timeTOround = controller.simTime;
    let timeUnits = '&nbsp;' ;
    if (simParams.simTimeUnits) {
      timeUnits += simParams.simTimeUnits;
    } else {
      
      timeUnits += 's';
    }
    if (simParams.labType == 'Dynamic') {
      tText += '<p>Simulation time of data capture = ' + timeTOround.toFixed(3)
               + timeUnits + '<br>';
    } else {
      
      tText += '<p>Total runs at time of data capture = ' + timeTOround.toFixed(0) + '<br>';
    }

    tText += 'Values of input parameters at time of data capture:<br>';
   
    for (u in processUnits) {
      tText += '* ' + processUnits[u]['name'] + '<br>';
      numVar = processUnits[u]['varCount'];
      for (v = 0; v <= numVar; v++) { // NOTE: <=
        if (processUnits[u]['dataQuizInputs']) {
          
          if (processUnits[u]['dataQuizInputs'][v]) {
           
            if (processUnits[u]['dataQuizInputs'][v] == 'answered'){
              
              varValue = processUnits[u]['dataValues'][v];
              varValue = this.formatNumToNum(varValue);
              tText += '&nbsp; &nbsp;' + processUnits[u]['dataHeaders'][v] + ' = '
                      + varValue + '&nbsp;'
                      + processUnits[u]['dataUnits'][v] + ' * ANSWERED * <br>';
            } else {
           
            tText += '&nbsp; &nbsp;' + processUnits[u]['dataHeaders'][v] + ' = '
                    + '???' + '&nbsp;'
                    + processUnits[u]['dataUnits'][v] + ' * UNKNOWN * <br>';
            }
          } else {
           
            varValue = processUnits[u]['dataValues'][v];
            varValue = this.formatNumToNum(varValue);
            tText += '&nbsp; &nbsp;' + processUnits[u]['dataHeaders'][v] + ' = '
                    + varValue + '&nbsp;'
                    + processUnits[u]['dataUnits'][v] + '<br>';
          }
        } else {
           
            varValue = processUnits[u]['dataValues'][v];
            varValue = this.formatNumToNum(varValue);
            tText += '&nbsp; &nbsp;' + processUnits[u]['dataHeaders'][v] + ' = '
                    + varValue + '&nbsp;'
                    + processUnits[u]['dataUnits'][v] + '<br>';
        }
      }
    }
    tText += '</p>';

    tText += '<p>' + plotInfo[plotIndex]['title'] + '</p>';

   
      tText += '<p>';

    let plotType = plotInfo[plotIndex]['type']; 
    let dataName = plotType + 'Data'; 
    if ((plotType == 'profile') || (plotType == 'strip')) {
      
      tText += '<p>';
      
      tText += plotInfo[plotIndex]['xAxisTableLabel'] + tItemDelimiter;
     
      for (v = 0; v < tVarLen; v++) {
        tText += plotInfo[plotIndex]['varLabel'][v];

        
        let tUnits = plotInfo[plotIndex]['varDataUnits'][v];
        if (tUnits != '') {
          tText += ' (' + plotInfo[plotIndex]['varDataUnits'][v] + ')';
        }

        if (v < (tVarLen - 1)) {
          tText += tItemDelimiter;
        }
      }
      tText += '</p>';
      
      varUnitIndex = plotInfo[plotIndex]['varUnitIndex'][0];
      let thisNumPts = processUnits[varUnitIndex][dataName][0].length;
      //
      for (p = 0; p < thisNumPts; p++) {
       
        varIndex = plotInfo[plotIndex]['var'][0];
        varUnitIndex = plotInfo[plotIndex]['varUnitIndex'][0];
        tText += formatNum(processUnits[varUnitIndex][dataName][varIndex][p][0]) + tItemDelimiter;
          
          for (v = 0; v < tVarLen; v++) {
            varIndex = plotInfo[plotIndex]['var'][v];
            varUnitIndex = plotInfo[plotIndex]['varUnitIndex'][v];
            tText += formatNum(processUnits[varUnitIndex][dataName][varIndex][p][1]); 
            if (v < (tVarLen - 1)) {tText += tItemDelimiter;}
          }
        tText += '<br>'; 
      }
    } else if (plotType == 'single'){
      varUnitIndex = plotInfo[plotIndex]['varUnitIndex'][0];
      let dataName = 'singleData';
      let thisNumPts = processUnits[varUnitIndex][dataName][0].length;
      tVarLen = processUnits[varUnitIndex].singleData.length;
      tVarLen = tVarLen - 1; 
      
      tText += '<p>';
      
      tText += 'run #' + tItemDelimiter;
     
      for (v = 0; v < tVarLen; v++) {
        if (processUnits[varUnitIndex]['dataSwitcher'][v] == 1) {
          tText += processUnits[varUnitIndex]['dataHeaders'][v];
          let tUnits = processUnits[varUnitIndex]['dataUnits'][v];
          if (tUnits != '') {
            tText += ' (' + tUnits + ')';
          }
          if (v < (tVarLen - 1)) {
            tText += tItemDelimiter;
          }
        } 
      } 
      tText += '</p>';
     
      for (p = 0; p < thisNumPts; p++) {
        
        tText += processUnits[varUnitIndex][dataName][tVarLen][p][0] + tItemDelimiter;
       
        for (v = 0; v < tVarLen; v++) {
          if (processUnits[varUnitIndex]['dataSwitcher'][v] == 1) {
            tText += formatNum(processUnits[varUnitIndex][dataName][v][p][0]);
            if (v < (tVarLen - 1)) {tText += tItemDelimiter;}
          }
        }
        tText += '<br>'; 
      }
    } else {
      alert('unknown plot type');
      return;
    }

    tText += '</p>';

    
    let dataWindow = window.open('', 'Copy data',
          'height=600, left=20, resizable=1, scrollbars=1, top=40, width=600');
    

    dataWindow.document.writeln('<html><head><title>Copy data</title></head>' +
           '<body>' +
           tText +
           '</body></html>');
    dataWindow.document.close();

    function formatNum(nn) {
     
      if (isNaN(nn)) {
        return nn;
      }
      
      if ((nn > 1000) || (nn < -1000)) {
        nn = nn.toExponential(4);
      } else if ((nn > 100) || (nn < -100)) {
        nn = nn.toFixed(2);
      } else if ((nn > 10) || (nn < -10)) {
        nn = nn.toFixed(3);
      } else if ((nn >= 1) || (nn < -1)) {
        nn = nn.toFixed(3);
      } else if ((nn > 0.01) || (nn < -0.01)) {
        nn = nn.toFixed(4);
      } else {
        nn = nn.toExponential(4);
      }
      return nn;
    } 

  },

  formatNumToNum : function(varValue) {
    
    varValue = Number(varValue); 
    if (varValue == 0) {
      
      } else if (Math.abs(varValue) < 1.0e-3) {
        varValue = varValue.toExponential(2); 
      } else if (Math.abs(varValue) >= 9.999e+3) {
        varValue = varValue.toExponential(2); 
    }
    varValue = Number(varValue); 
    return varValue;
  }, 

}; 
