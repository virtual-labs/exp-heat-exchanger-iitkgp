

let plotInfo = {

  initialize : function() {

    let unum = 0; 

    
    let pnum = 0;
    plotInfo[pnum] = new Object();
    plotInfo[pnum]['type'] = 'profile';
    plotInfo[pnum]['title'] = 'Heat Exchanger Temperature Profiles';
    plotInfo[pnum]['canvas'] = '#div_PLOTDIV_T_plot'; 
    
    plotInfo[pnum]['numberPoints'] = processUnits[unum]['numNodes']; 
    
    plotInfo[pnum]['xAxisLabel'] = 'Position in Exchanger';
    plotInfo[pnum]['xAxisTableLabel'] = 'Position'; 
    
    plotInfo[pnum]['xAxisShow'] = 1; 
    plotInfo[pnum]['xAxisMin'] = 0;
    plotInfo[pnum]['xAxisMax'] = 1;
    plotInfo[pnum]['xAxisReversed'] = 1; 
    plotInfo[pnum]['yLeftAxisLabel'] = 'T (K)';
    plotInfo[pnum]['yLeftAxisMin'] = processUnits[unum]['dataMin'][1]; 
    plotInfo[pnum]['yLeftAxisMax'] = processUnits[unum]['dataMax'][0];
    plotInfo[pnum]['yRightAxisLabel'] = 'yRight';
    plotInfo[pnum]['yRightAxisMin'] = 0;
    plotInfo[pnum]['yRightAxisMax'] = 1;
    plotInfo[pnum]['plotLegendShow'] = 1;  
    plotInfo[pnum]['plotLegendPosition'] = 'se';
    plotInfo[pnum]['plotGridBgColor'] = 'white';
    
    plotInfo[pnum]['plotDataSeriesColors'] = ['#ff6347','#1e90ff']; 
   
    plotInfo[pnum]['varUnitIndex'] = new Array();
    plotInfo[pnum]['var'] = new Array();
    plotInfo[pnum]['varLabel'] = new Array();
    plotInfo[pnum]['varDataUnits'] = new Array();
    plotInfo[pnum]['varShow'] = new Array();
    plotInfo[pnum]['varYaxis'] = new Array();
    plotInfo[pnum]['varYscaleFactor'] = new Array();
   
    let vnum = 0; 
    plotInfo[pnum]['varUnitIndex'][0] = unum; 
    plotInfo[pnum]['var'][vnum] = 0; 
    plotInfo[pnum]['varLabel'][vnum] = 'Thot';
   
    plotInfo[pnum]['varDataUnits'][vnum] = processUnits[unum]['dataUnits'][0]; 
    
    plotInfo[pnum]['varShow'][vnum] = 'show';
    plotInfo[pnum]['varYaxis'][vnum] = 'left';
    plotInfo[pnum]['varYscaleFactor'][vnum] = 1;
    
    vnum = 1; 
    plotInfo[pnum]['varUnitIndex'][1] = unum;
    plotInfo[pnum]['var'][vnum] = 1;
    plotInfo[pnum]['varLabel'][vnum] = 'Tcold';
    plotInfo[pnum]['varDataUnits'][vnum] = processUnits[unum]['dataUnits'][1];
    plotInfo[pnum]['varShow'][vnum] = 'show';
    plotInfo[pnum]['varYaxis'][vnum] = 'left';
    plotInfo[pnum]['varYscaleFactor'][vnum] = 1;
    
    pnum = 1;
    plotInfo[pnum] = new Object();
    plotInfo[pnum]['type'] = 'canvas';
    plotInfo[pnum]['title'] = 'hot side color canvas';
    plotInfo[pnum]['canvas'] = 'canvas_CANVAS_hot'; 
   
    plotInfo[pnum]['varUnitIndex'] = unum; 
    plotInfo[pnum]['var'] = 0; 
  
    plotInfo[pnum]['varTimePts'] = processUnits[unum]['numNodes'];
    plotInfo[pnum]['varSpacePts'] = 1;
    plotInfo[pnum]['varValueMin'] = processUnits[unum]['dataMin'][1]; 
    plotInfo[pnum]['varValueMax'] = processUnits[unum]['dataMax'][0]; 
    plotInfo[pnum]['xAxisReversed'] = 1; 

    pnum = 2;
    plotInfo[pnum] = new Object();
    plotInfo[pnum]['type'] = 'canvas';
    plotInfo[pnum]['title'] = 'cold side color canvas';
    plotInfo[pnum]['canvas'] = 'canvas_CANVAS_cold';
 
    plotInfo[pnum]['varUnitIndex'] = unum; 
    plotInfo[pnum]['var'] = 1; 
    
    plotInfo[pnum]['varTimePts'] = processUnits[unum]['numNodes'];
    plotInfo[pnum]['varSpacePts'] = 1;
    plotInfo[pnum]['varValueMin'] = processUnits[unum]['dataMin'][1]; 
    plotInfo[pnum]['varValueMax'] = processUnits[unum]['dataMax'][0]; 
    plotInfo[pnum]['xAxisReversed'] = 1; 

  }, 

} 
