

let puCoCounterHeatExchanger = {
  unitIndex : 0, 
  name : 'Heat Exchanger',

  updateInputs : function() {}, 
  inputModel00 : "radio_co-current_flow", 
  inputModel01 : "radio_counter-current_flow", 

  displayHotLeftT: 'field_hot_left_T',
  displayHotRightT: 'field_hot_right_T',
  displayColdLeftT: 'field_cold_left_T',
  displayColdRightT: 'field_cold_right_T',
  displayReynoldsNumber : 'field_Reynolds',
  displayLength : 'field_length',
  displayColdLeftArrow : '#field_cold_left_arrow', 
  displayColdRightArrow : '#field_cold_right_arrow', 

  TinHot : 0,
  TinCold : 0,
  FlowHot : 0,
  FlowCold : 0,
  CpHot : 0,
  CpCold : 0,
  Ucoef : 0,
  Area : 0,
  Diam : 0,
  varCount : 0, 

  dataHeaders : [], 
  dataInputs : [], 
  dataUnits : [],
  dataMin : [],
  dataMax : [],
  dataDefault : [],
  dataValues : [],

  Thot : [],
  Tcold : [],
  ThotNew : [], 
  TcoldNew : [],

  profileData : [], 
  stripData : [],
  colorCanvasData : [], 
  unitStepRepeats : 1,
  unitTimeStep : simParams.simTimeStep / this.unitStepRepeats,


  ModelFlag : 1, 
  numNodes : 200,
 

  ssCheckSum : 0, 
  residenceTime : 0, 
 
  FluidKinematicViscosity : 5.0e-7, 
  FluidDensity : 1000.0, 
  DispCoef : 0, 

  initialize : function() {
    //
    let v = 0;
    this.dataHeaders[v] = 'TinHot';
    this.dataInputs[v] = 'input_field_TinHot';
    this.dataUnits[v] = 'K';
    this.dataMin[v] = 300;
    this.dataMax[v] = 370;
    this.dataDefault[v] = 360;
    //
    v = 1;
    this.dataHeaders[v] = 'TinCold';
    this.dataInputs[v] = 'input_field_TinCold';
    this.dataUnits[v] = 'K';
    this.dataMin[v] = 300;
    this.dataMax[v] = 370;
    this.dataDefault[v] = 310;
    //
    v = 2;
    this.dataHeaders[v] = 'FlowHot';
    this.dataInputs[v] = 'input_field_FlowHot';
    this.dataUnits[v] = 'kg/s';
    this.dataMin[v] = 0.15;
    this.dataMax[v] = 4.0;
    this.dataDefault[v] = 0.5;
    //
    v = 3;
    this.dataHeaders[v] = 'FlowCold';
    this.dataInputs[v] = 'input_field_FlowCold';
    this.dataUnits[v] = 'kg/s';
    this.dataMin[v] = 0.15;
    this.dataMax[v] = 4.0;
    this.dataDefault[v] = 0.75;
    //
    v = 4;
    this.dataHeaders[v] = 'CpHot';
    this.dataInputs[v] = 'input_field_CpHot';
    this.dataUnits[v] =  'kJ/kg/K';
    this.dataMin[v] = 1;
    this.dataMax[v] = 10;
    this.dataDefault[v] = 4.2;
    //
    v = 5;
    this.dataHeaders[v] = 'CpCold';
    this.dataInputs[v] = 'input_field_CpCold';
    this.dataUnits[v] =  'kJ/kg/K';
    this.dataMin[v] = 1;
    this.dataMax[v] = 10;
    this.dataDefault[v] = 4.2;
    //
    v = 6;
    this.dataHeaders[v] = 'Ucoef';
    this.dataInputs[v] = 'input_field_Ucoef';
    this.dataUnits[v] =  'kW/m2/K';
    this.dataMin[v] = 0;
    this.dataMax[v] = 10;
    this.dataDefault[v] = 0.6;
    //
    v = 7;
    this.dataHeaders[v] = 'Area';
    this.dataInputs[v] = 'input_field_Area';
    this.dataUnits[v] =  'm2';
    this.dataMin[v] = 1;
    this.dataMax[v] = 10;
    this.dataDefault[v] = 4;
    //
    v = 8;
    this.dataHeaders[v] = 'Diam';
    this.dataInputs[v] = 'input_field_Diam';
    this.dataUnits[v] =  'm';
    this.dataMin[v] = 0.02;
    this.dataMax[v] = 0.20;
    this.dataDefault[v] = 0.15;
    
    this.varCount = v;
   
    v = 9;
    this.dataHeaders[v] = 'Thot';
    this.dataUnits[v] =  'K';
    this.dataMin[v] = this.dataMin[1]; 
    this.dataMax[v] = this.dataMax[0]; 
    //
    v = 10;
    this.dataHeaders[v] = 'Tcold';
    this.dataUnits[v] =  'K';
    this.dataMin[v] = this.dataMin[1]; 
    this.dataMax[v] = this.dataMax[0]; 
    //
  }, 

  reset : function() {
    
    this.updateUIparams(); 

    for (k = 0; k <= this.numNodes; k += 1) {
      this.Thot[k] = this.TinCold;
      this.ThotNew[k] = this.TinCold;
      this.Tcold[k] = this.TinCold;
      this.TcoldNew[k] = this.TinCold;
    }

    this.profileData = plotter.initPlotData(2,this.numNodes); 

    this.colorCanvasData = plotter.initColorCanvasArray(2,this.numNodes,1);

    let kn = 0;
    for (k=0; k<=this.numNodes; k+=1) {
      kn = k/this.numNodes;
     
      this.profileData[0][k][0] = kn;
      this.profileData[1][k][0] = kn;
     
      this.profileData[0][k][1] = 0;
      this.profileData[1][k][1] = 0;
    }

  }, 

  updateUIparams : function() {
    
    controller.resetSSflagsFalse();
   
    this.ssCheckSum = 1;

    let m00 = document.querySelector('#' + this.inputModel00);
    let cra = document.querySelector(this.displayColdRightArrow);
    let cla = document.querySelector(this.displayColdLeftArrow);
    if (m00.checked) {
      this.ModelFlag = 0; 
      cra.style.color = 'blue';
      cla.style.color = 'orange';
      cra.innerHTML = '&larr;';
      cla.innerHTML = '&larr;';
    } else {
      this.ModelFlag = 1; 
      cra.style.color = 'orange';
      cla.style.color = 'blue';
      cra.innerHTML = '&rarr;';
      cla.innerHTML = '&rarr;';
    }

    let unum = this.unitIndex;
    //
    this.TinHot = this.dataValues[0] = interfacer.getInputValue(unum, 0);
    this.TinCold = this.dataValues[1] = interfacer.getInputValue(unum, 1);
    this.FlowHot = this.dataValues[2] = interfacer.getInputValue(unum, 2);
    this.FlowCold = this.dataValues[3] = interfacer.getInputValue(unum, 3);
    this.CpHot = this.dataValues[4] = interfacer.getInputValue(unum, 4);
    this.CpCold = this.dataValues[5] = interfacer.getInputValue(unum, 5);
    this.Ucoef = this.dataValues[6] = interfacer.getInputValue(unum, 6);
    this.Area = this.dataValues[7] = interfacer.getInputValue(unum, 7);
    this.Diam = this.dataValues[8] = interfacer.getInputValue(unum, 8);

    document.getElementById(this.displayHotRightT).innerHTML = this.TinHot.toFixed(1) + ' K';
    switch(this.ModelFlag) {
      case 0: 
        document.getElementById(this.displayColdRightT).innerHTML = this.TinCold.toFixed(1) + ' K';
        break
      case 1: 
        document.getElementById(this.displayColdLeftT).innerHTML = this.TinCold.toFixed(1) + ' K';
    }

    
    let Length = this.Area / this.Diam / Math.PI;

    document.getElementById(this.displayLength).innerHTML = 'L (m) = ' + Length.toFixed(1);
    
    let Re = this.FlowHot / this.FluidDensity / this.FluidKinematicViscosity * 4 / Math.PI / this.Diam;
    document.getElementById(this.displayReynoldsNumber).innerHTML = 'Re<sub> hot-tube</sub> = ' + Re.toFixed(0);

    let Ax = Math.PI * Math.pow(this.Diam, 2) / 4.0; 
    let VelocHot = this.FlowHot / this.FluidDensity / Ax; 
    this.DispCoef = VelocHot * this.Diam * (3.0e7/Math.pow(Re, 2.1) + 1.35/Math.pow(Re, 0.125)); 

    this.residenceTime = Length / VelocHot;

    let spaceTime = (Length / this.numNodes) / VelocHot; // (s)

    
    this.unitTimeStep = spaceTime / 15;

   
    this.unitStepRepeats = Math.round(simParams.simTimeStep / this.unitTimeStep);
    
    if (this.unitStepRepeats <= 0) {this.unitStepRepeats = 1;}

    this.unitTimeStep = simParams.simTimeStep / this.unitStepRepeats;

  },
  updateState : function() {
    
    this.unitTimeStep = simParams.simTimeStep / this.unitStepRepeats;

   
    let Length = this.Area / this.Diam / Math.PI;

    
    let Ax = Math.PI * Math.pow(this.Diam, 2) / 4.0; 
    let VelocHot = this.FlowHot / this.FluidDensity / Ax; 
   
    let VelocCold = this.FlowCold / this.FluidDensity / Ax; 
    let XferCoefHot = this.Ucoef * Math.PI * this.Diam / this.FluidDensity / this.CpHot / Ax;
    let XferCoefCold = this.Ucoef * Math.PI * this.Diam / this.FluidDensity / this.CpCold / Ax;
   
    let DispHot = this.DispCoef; 
    
    let DispCold = DispHot; 
    let dz = Length / this.numNodes; 
    let VelocHotOverDZ = VelocHot / dz; 
    let VelocColdOverDZ = VelocCold / dz; 
    let DispHotOverDZ2 = DispHot / Math.pow(dz, 2);  
    let DispColdOverDZ2 = DispCold / Math.pow(dz, 2); 

    let i = 0; 
    let n = 0;
    let ThotN = 0.0;
    let ThotNm1 = 0.0;
    let ThotNp1 = 0.0;
    let TcoldN = 0.0;
    let TcoldNm1 = 0.0;
    let TcoldNp1 = 0.0;
    let dThotDT = 0.0;
    let dTcoldDT = 0.0;
    let minTinCold = this.dataMin[1];
    let maxTinHot = this.dataMax[0];

    for (i=0; i<this.unitStepRepeats; i+=1) {

      
      n = 0;

      this.ThotNew[0] = this.TinHot;
      switch(this.ModelFlag) {
        case 0: 
          this.TcoldNew[0] = this.TinCold;
        break
        case 1: 
          this.TcoldNew[0] = this.Tcold[1];
      }

     
      for (n = 1; n < this.numNodes; n += 1) {

        

        ThotN = this.Thot[n];
        ThotNm1 = this.Thot[n-1];
        ThotNp1 = this.Thot[n+1];
        dThotDT = VelocHotOverDZ*(ThotNm1-ThotN) + XferCoefHot*(TcoldN-ThotN)
                      + DispHotOverDZ2 * (ThotNp1 - 2.0 * ThotN + ThotNm1);

        TcoldN = this.Tcold[n];
        TcoldNm1 = this.Tcold[n-1];
        TcoldNp1 = this.Tcold[n+1];
        switch(this.ModelFlag) {
          case 0: 
            dTcoldDT = VelocColdOverDZ*(TcoldNm1-TcoldN) + XferCoefCold*(ThotN-TcoldN)
                          + DispColdOverDZ2 * (TcoldNp1 - 2.0 * TcoldN + TcoldNm1);
          break
          case 1: 
            dTcoldDT = VelocColdOverDZ*(TcoldNp1-TcoldN) + XferCoefCold*(ThotN-TcoldN)
                          + DispColdOverDZ2 * (TcoldNp1 - 2.0 * TcoldN + TcoldNm1);
        }

        ThotN = ThotN + dThotDT * this.unitTimeStep;
        TcoldN = TcoldN + dTcoldDT * this.unitTimeStep;

       
        if (ThotN > maxTinHot) {ThotN = maxTinHot;}
        if (ThotN < minTinCold) {ThotN = minTinCold;}
        if (TcoldN > maxTinHot) {TcoldN = maxTinHot;}
        if (TcoldN < minTinCold) {TcoldN = minTinCold;}

        this.ThotNew[n] = ThotN;
        this.TcoldNew[n] = TcoldN;

      } 

      

      n = this.numNodes;

      this.ThotNew[n] = this.Thot[n - 1];
      switch(this.ModelFlag) {
        case 0: 
          this.TcoldNew[n] = this.Tcold[n-1];
        break
        case 1: 
          this.TcoldNew[n] = this.TinCold;
      }

      
      this.Thot = this.ThotNew;
      this.Tcold = this.TcoldNew;

    } 

  }, 

  updateDisplay : function() {

   

    let n = 0; 

    document.getElementById(this.displayHotLeftT).innerHTML = this.Thot[this.numNodes].toFixed(1) + ' K';
    document.getElementById(this.displayHotRightT).innerHTML = this.TinHot.toFixed(1) + ' K';
    switch(this.ModelFlag) {
      case 0: 
        document.getElementById(this.displayColdLeftT).innerHTML = this.Tcold[this.numNodes].toFixed(1) + ' K';
        document.getElementById(this.displayColdRightT).innerHTML = this.TinCold.toFixed(1) + ' K';
        break
      case 1: 
        document.getElementById(this.displayColdLeftT).innerHTML = this.TinCold.toFixed(1) + ' K';
        document.getElementById(this.displayColdRightT).innerHTML = this.Tcold[0].toFixed(1) + ' K';
    }

   

    for (n=0; n<=this.numNodes; n+=1) {
      this.profileData[0][n][1] = this.Thot[n]; 
      this.profileData[1][n][1] = this.Tcold[n]; 
    }


    
    for (n=0; n<=this.numNodes; n+=1) {
      this.colorCanvasData[0][n][0] = this.Thot[n];
      this.colorCanvasData[1][n][0] = this.Tcold[n];
    }


  }, 

  checkForSteadyState : function() {
    
    let nn = this.numNodes;
    let hlt = 1.0e1 * this.Thot[nn];
    let hrt = 1.0e1 * this.Thot[0];
    let clt = 1.0e1 * this.Tcold[nn];
    let crt = 1.0e1 * this.Tcold[0];
    hlt = hlt.toFixed(0); 
    hrt = hrt.toFixed(0);
    clt = clt.toFixed(0);
    crt = crt.toFixed(0);
    
    let newCheckSum = hlt +'.'+ hrt +'.'+ clt  +'.'+ crt;
    let oldSScheckSum = this.ssCheckSum;
   
    let ssFlag = false;
    if (newCheckSum == oldSScheckSum) {ssFlag = true;}
    this.ssCheckSum = newCheckSum; 
    return ssFlag;
  } 

}; 
