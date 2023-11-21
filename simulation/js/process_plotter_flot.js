

let plotter = {
  

  plotArrays : {
   
    plot : [],

   
    plotFlag : [], 

    initialize : function() {
     
      this.plotFlag = [0];
      for (let p in plotInfo) {
        this.plotFlag.push(0);
      }
    } 

  }, 


  getPlotData : function(plotIndex) {
   

    let v; 
    let p; 
    let n;
    let sf = 1; 
    let thisNumPts; 
    let dataName;
    let varNumbers = plotInfo[plotIndex]['var'];
    let numVar = varNumbers.length;

    let xVar; 
    let yVar; 
   
    let plotData = []; 
    let plotType = plotInfo[plotIndex]['type']; 
    dataName = plotType + 'Data';
    if ((plotType == 'profile') || (plotType == 'strip') || (plotType == 'single')) {
      v = 0;
      n = varNumbers[v];
      varUnitIndex = plotInfo[plotIndex]['varUnitIndex'][v];
      thisNumPts = processUnits[varUnitIndex][dataName][n].length;
      plotData = this.initPlotData(numVar, thisNumPts-1); 
    } else {
      alert('in getPlotData, unknown plot type');
    }

    
    for (v = 0; v < numVar; v++) {

      
      varUnitIndex = plotInfo[plotIndex]['varUnitIndex'][v];
     
      n = varNumbers[v];
     

      sf = plotInfo[plotIndex]['varYscaleFactor'][v];
      if (sf != 1) {
       
        if (plotInfo[plotIndex]['type'] == 'profile') {
          
          thisNumPts = processUnits[varUnitIndex]['profileData'][n].length;
            for (p = 0; p < thisNumPts; p++) {
            plotData[v][p][0] = processUnits[varUnitIndex]['profileData'][n][p][0];
            plotData[v][p][1] = processUnits[varUnitIndex]['profileData'][n][p][1];
          }
        } else if (plotInfo[plotIndex]['type'] == 'strip') {
          
          thisNumPts = processUnits[varUnitIndex]['stripData'][n].length;
          for (p = 0; p < thisNumPts; p++) {
            plotData[v][p][0] = processUnits[varUnitIndex]['stripData'][n][p][0];
            plotData[v][p][1] = processUnits[varUnitIndex]['stripData'][n][p][1];
          }
        } else if (plotInfo[plotIndex]['type'] == 'single') {
          
          xVar = simParams.xVar;
          yVar = simParams.yVar;
          dataName = 'singleData';
          thisNumPts = processUnits[varUnitIndex][dataName][n].length;
          for (p = 0; p < thisNumPts; p++) {
            plotData[v][p][0] = processUnits[varUnitIndex][dataName][xVar][p][0];
            plotData[v][p][1] = processUnits[varUnitIndex][dataName][yVar][p][1];
          }
        } else {
          alert('in getPlotData, unknown plot type');
        }
      } else {
        
        if (plotInfo[plotIndex]['type'] == 'profile') {
          plotData[v] = processUnits[varUnitIndex]['profileData'][n];
        } else if (plotInfo[plotIndex]['type'] == 'strip') {
          plotData[v] = processUnits[varUnitIndex]['stripData'][n];
        } else if (plotInfo[plotIndex]['type'] == 'single') {
          
          xVar = simParams.xVar;
          yVar = simParams.yVar;
          dataName = 'singleData';
          thisNumPts = processUnits[varUnitIndex][dataName][n].length;
          for (p = 0; p < thisNumPts; p++) {
            plotData[v][p][0] = processUnits[varUnitIndex][dataName][xVar][p][0];
            plotData[v][p][1] = processUnits[varUnitIndex][dataName][yVar][p][0];
          }
        } else {
          alert('in getPlotData, unknown plot type');
        }
      }

    } 

   
    for (v = 0; v < numVar; v++) {
      sf = plotInfo[plotIndex]['varYscaleFactor'][v];
      thisNumPts = plotData[v].length;
      if (sf != 1) {
        for (p = 0; p < thisNumPts; p++) {
          plotData[v][p][1] = sf * plotData[v][p][1];
        }
      }
    }

    return plotData;

  }, 

  plotPlotData: function(pData,pIndex) {

   

    let plotList = plotInfo[pIndex]['var'];
   

    let k = 0; 
    let v = 0; 
    let vLabel = []; 
    let yAxis = []; 
    let vShow = []; 
    plotList.forEach(fGetAxisData);
    function fGetAxisData(v,k) {
  	 
      yAxis[k] = plotInfo[pIndex]['varYaxis'][k];
      vShow[k] = plotInfo[pIndex]['varShow'][k];
      vLabel[k] = plotInfo[pIndex]['varLabel'][k];
    }

   

    let plotCanvasHtmlID = plotInfo[pIndex]['canvas'];

    let dataToPlot = [];
    let numVar = plotList.length;
    let numToShow = 0;
   
    for (k = 0; k < numVar; k++) {
     
      let newobj = {};
      if (vShow[k] === 'show') {
        
        newobj.data = pData[k];
        newobj.label = vLabel[k];
        if (yAxis[k] === 'right') {newobj.yaxis = 1;} else {newobj.yaxis = 2;}
        dataToPlot[k] = newobj;
      } else if (vShow[k] == 'tabled') {
       
      } else {
        
        newobj.data = [plotInfo[pIndex]['xAxisMax'],plotInfo[pIndex]['yLeftAxisMax']];
        newobj.label = vLabel[k];
        if (yAxis[k] === 'right') {newobj.yaxis = 1;} else {newobj.yaxis = 2;}
        dataToPlot[k] = newobj;
      }
    } 

  

    let xShow = plotInfo[pIndex]['xAxisShow'];
    let xLabel = plotInfo[pIndex]['xAxisLabel'];
    let xMin= plotInfo[pIndex]['xAxisMin'];
    let xMax = plotInfo[pIndex]['xAxisMax'];
    let yLeftLabel = plotInfo[pIndex]['yLeftAxisLabel'];
    let yLeftMin = plotInfo[pIndex]['yLeftAxisMin'];
    let yLeftMax = plotInfo[pIndex]['yLeftAxisMax'];
    let yRightLabel = plotInfo[pIndex]['yRightAxisLabel'];
    let yRightMin = plotInfo[pIndex]['yRightAxisMin'];
    let yRightMax = plotInfo[pIndex]['yRightAxisMax'];
    let plotLegendPosition = plotInfo[pIndex]['plotLegendPosition'];
    let plotLegendShow = plotInfo[pIndex]['plotLegendShow']; 
    let plotGridBgColor = plotInfo[pIndex]['plotGridBgColor'];
    let plotDataSeriesColors = plotInfo[pIndex]['plotDataSeriesColors'];
   
    let plotDataPoints = false;
    let plotDataLines = true;
    if (typeof plotInfo[pIndex]['plotDataPoints'] == 'undefined') {
      plotDataPoints = false; 
      plotDataPoints = plotInfo[pIndex]['plotDataPoints'];
    }
    if (typeof plotInfo[pIndex]['plotDataLines'] == 'undefined') {
      plotDataLines = true; 
    } else {
      plotDataLines = plotInfo[pIndex]['plotDataLines'];
    }

    let options = {
      
      axisLabels : {show: true},
      xaxes: [ { show: xShow, min: xMin, max: xMax, axisLabel: xLabel } ],
      yaxes: [
      
        {position: 'right', min: yRightMin, max: yRightMax, axisLabel: yRightLabel },
        {position: 'left', min: yLeftMin, max: yLeftMax, axisLabel: yLeftLabel },
      ],
      legend: { show: plotLegendShow, position: plotLegendPosition },
      grid: { backgroundColor: plotGridBgColor },
      series: {
        lines: { show: plotDataLines },
        points: { show: plotDataPoints, radius: 2 }
      },
      colors: plotDataSeriesColors
    };

    
    if (plotInfo[pIndex]['xAxisReversed']) {
      options.xaxis = {
        transform: function (v) { return -v; },
        inverseTransform: function (v) { return -v; }
      };
    }

    

    if (this.plotArrays['plotFlag'][pIndex] == 0) {
      this.plotArrays['plotFlag'][pIndex] = 1;
      this.plotArrays['plot'][pIndex] = $.plot($(plotCanvasHtmlID), dataToPlot, options);
    } else {
      this.plotArrays['plot'][pIndex].setData(dataToPlot);
      this.plotArrays['plot'][pIndex].draw();
    }

  }, 

  initPlotData : function(numVars,numPlotPoints) {
    
    let v;
    let p;
    let plotDataStub = [];
    for (v = 0; v < numVars; v++) {
      plotDataStub[v] = [];
      for (p = 0; p <= numPlotPoints; p++) { 
        plotDataStub[v][p] = [];
        plotDataStub[v][p][0] = 0;
        plotDataStub[v][p][1] = 0;
      }
    }
    return plotDataStub;
   
  }, 

  

  plotColorCanvasPlot : function(pIndex) {
   

    let canvasID = plotInfo[pIndex]['canvas'];
    let canvas = document.getElementById(canvasID);
    let context = canvas.getContext('2d');

   
    let varUnitIndex = plotInfo[pIndex]['varUnitIndex'];
    
    let v = plotInfo[pIndex]['var'];

    let colorCanvasData = processUnits[varUnitIndex]['colorCanvasData'][v];

    let t;
    let s;
    let r;
    let g;
    let b;
    let cmap;
    let x;
    let y;
   
    let tColor1 = 'rgb(';
    let tColor2;
    let tColor3;
    let tColor4;
    let tColor5 = ')';
    let tPixels = canvas.width; 
    let sPixels = canvas.height;
    let numTimePts = plotInfo[pIndex]['varTimePts'];
    let numSpacePts = plotInfo[pIndex]['varSpacePts'];
    let tPixelsPerPoint = tPixels/(numTimePts+1); 
    let sPixelsPerPoint = sPixels/numSpacePts;
   
    let minVarVal = plotInfo[pIndex]['varValueMin'];
    let maxVarVal = plotInfo[pIndex]['varValueMax'];
    let scaledVarVal; 

    for (t = 0; t <= numTimePts; t++) { 
      for (s = 0; s < numSpacePts; s++) {
        scaledVarVal = (colorCanvasData[t][s] - minVarVal) / (maxVarVal - minVarVal);
        if (plotInfo[pIndex]['colorMap'] == 'redBlueColorMap') {
          cmap = this.redBlueColorMap(scaledVarVal); 
        } else {
          cmap = this.jetColorMap(scaledVarVal); 
        }
        r = cmap[0];
        g = cmap[1];
        b = cmap[2];
       
        tColor2 = r.toString();
        tColor3 = g.toString();
        tColor4 = b.toString();
        tColor = tColor1.concat(tColor2,',',tColor3,',',tColor4,tColor5);
        context.fillStyle = tColor;
        if (plotInfo[pIndex]['xAxisReversed']) {
         
          x = tPixelsPerPoint * (numTimePts - t);
        } else {
          x = tPixelsPerPoint * t;
        }
        y = sPixelsPerPoint * s;
        
        context.fillRect(x,y,tPixelsPerPoint,sPixelsPerPoint);
      } 
    } 

  }, 

  redBlueColorMap : function(n) {
   
    if (n<0) {n = 0;}
    if (n>1) {n = 1;}
    let b = Math.round(255*n); 
    let r = 255 - b; 
    let g = 0;
    return [r,g,b];
  }, 

  jetColorMap : function(n) {
    
    let r;
    let g;
    let b;
    if (n<0) {n = 0;}
    if (n>1) {n = 1;}
   
    let n64 = Math.round(1 + 63*n); 
    if (n64 >= 1 && n64 < 9) {
      r = 0;
      g = 0;
      b = (n64-1)/7*0.4375 + 0.5625;
    } else if (n64 >= 9 && n64 < 25) {
      r = 0;
      g = (n64-9)/15*0.9375 + 0.0625;
      b = 1;
    } else if (n64 >= 25 && n64 < 41) {
      r = (n64-25)/15*0.9375 + 0.0625;
      g = 1;
      b = -(n64-25)/15*0.9375 + 0.9375;
    } else if (n64 >= 41 && n64 < 57) {
      r = 1;
      g = -(n64-41)/15*0.9375 + 0.9375;
      b = 0;
    } else if (n64 >= 57 && n64 <= 64) {
      r = -(n64-57)/7*0.4375 + 0.9375;
      g = 0;
      b = 0;
    } else {
    
      r = 0;
      g = 0;
      b = 0.5625;
    } 
   
    r = Math.round(r*255);
    g = Math.round(g*255);
    b = Math.round(b*255);
    return [r,g,b];
  }, 

  initColorCanvasArray : function(numVars,numXpts,numYpts) {
    
    let v;
    let x;
    let y;
    let plotDataStub = [];
    for (v = 0; v < numVars; v++) {
      plotDataStub[v] = [];
        for (x = 0; x <= numXpts; x++) { 
        plotDataStub[v][x] = [];
        for (y = 0; y < numYpts; y++) {
          plotDataStub[v][x][y] = 0;
        }
      }
    }
    return plotDataStub;
  }, 

  plotColorCanvasPixelList : function(pIndex,xLocArray,yLocArray,small) {
    

    let canvasID = plotInfo[pIndex]['canvas'];
    let canvas = document.getElementById(canvasID);
    let context = canvas.getContext('2d');

    
    let varUnitIndex = plotInfo[pIndex]['varUnitIndex'];
    
    let v = plotInfo[pIndex]['var'];

   
    let colorCanvasData = processUnits[varUnitIndex]['colorCanvasData'][v];

    let t;
    let s;
    let r;
    let g;
    let b;
    let cmap;
    let x;
    let y;
    
    let tColor1 = 'rgb(';
    let tColor2;
    let tColor3;
    let tColor4;
    let tColor5 = ')';
    let tPixels = canvas.width; 
    let sPixels = canvas.height;
    let numTimePts = plotInfo[pIndex]['varTimePts'];
    let numSpacePts = plotInfo[pIndex]['varSpacePts'];
    let tPixelsPerPoint = tPixels/(numTimePts+1); 
    let sPixelsPerPoint = sPixels/numSpacePts; 
   
    let minVarVal = plotInfo[pIndex]['varValueMin'];
    let maxVarVal = plotInfo[pIndex]['varValueMax'];
    let scaledVarVal; 

    for (i=0; i < xLocArray.length; i++) {
      t = xLocArray[i];
      s = yLocArray[i];

      if (colorCanvasData[t][s] < 0) {
       
        scaledVarVal = ( - colorCanvasData[t][s] - minVarVal) / (maxVarVal - minVarVal);
      } else {
       
        scaledVarVal = (colorCanvasData[t][s] - minVarVal) / (maxVarVal - minVarVal);
      }
      if (plotInfo[pIndex]['colorMap'] == 'redBlueColorMap') {
        cmap = this.redBlueColorMap(scaledVarVal); 
      } else {
        cmap = this.jetColorMap(scaledVarVal); 
      }
      r = cmap[0];
      g = cmap[1];
      b = cmap[2];
     
      tColor2 = r.toString();
      tColor3 = g.toString();
      tColor4 = b.toString();
      tColor = tColor1.concat(tColor2,',',tColor3,',',tColor4,tColor5);
      context.fillStyle = tColor;
      if (plotInfo[pIndex]['xAxisReversed']) {
      
        x = tPixelsPerPoint * (numTimePts - t);
      } else {
        x = tPixelsPerPoint * t;
      }
      y = sPixelsPerPoint * s;

      if (colorCanvasData[t][s] >= 0) {
      
        if ((small == 1) && (tPixelsPerPoint >= 3) && (sPixelsPerPoint >= 3)) {
          
          context.fillRect(x+1,y+1,tPixelsPerPoint-2,sPixelsPerPoint-2);
        } else {
          context.fillRect(x,y,tPixelsPerPoint,sPixelsPerPoint);
        }
      } else {
       
        context.fillRect(x,y,tPixelsPerPoint,sPixelsPerPoint);
      }

    } 

  }, 

}; 
