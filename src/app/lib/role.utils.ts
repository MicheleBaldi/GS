export function getSheetNameByRole(role) {
    let sheetName = "Foglio1";
    switch (role) {
      case 'ResponsabileSband':
        sheetName = "Dati Sbandieratori";
        break;
      case 'ResponsabileTamburi':
        sheetName = "Dati Tamburi";
        break;
      case 'ResponsabileChiarine':
        sheetName = "Dati Chiarine";
        break;
      default:
        break;
    }
    return sheetName;
  }

  export function getRuoloPersone(role) {
    let ruolo = "";
    switch (role) {
      case 'ResponsabileSband':
        ruolo = "Sbandieratore";
        break;
      case 'ResponsabileTamburi':
        ruolo = "Tamburino";
        break;
      case 'ResponsabileChiarine':
        ruolo = "Chiarina";
        break;
      default:
        break;
    }
    return ruolo;
  }