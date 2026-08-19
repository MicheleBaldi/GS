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

  export function getSheetNameAggByRole(role) {
    let sheetName = "Foglio1";
    switch (role) {
      case 'ResponsabileSband':
        sheetName = "Presenze Sbandieratori";
        break;
      case 'ResponsabileTamburi':
        sheetName = "Presenze Tamburi";
        break;
      case 'ResponsabileChiarine':
        sheetName = "Presenze Chiarine";
        break;
      case 'ResponsabileGs':
      case 'ResponsabileMusici':
        sheetName = "";
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

  
  export function getSheetNameAggByRuoloAirtable(role) {
    let sheetName = "Foglio1";
    switch (role) {
      case 'Sbandieratore':
        sheetName = "Presenze Sbandieratori";
        break;
      case 'Tamburino':
        sheetName = "Presenze Tamburi";
        break;
      case 'Chiarina':
        sheetName = "Presenze Chiarine";
        break;
      default:
        break;
    }
    return sheetName;
  }

  export function needsRuoloSelect(role: string): boolean {
    return role === 'ResponsabileMusici' || role === 'ResponsabileGs';
  }

  export function getRuoloOptions(role: string): { value: string; label: string }[] {
    if (role === 'ResponsabileMusici') {
      return [
        { value: 'ResponsabileTamburi', label: 'Tamburi' },
        { value: 'ResponsabileChiarine', label: 'Chiarine' },
      ];
    }
    if (role === 'ResponsabileGs') {
      return [
        { value: 'ResponsabileSband', label: 'Sbandieratori' },
        { value: 'ResponsabileTamburi', label: 'Tamburi' },
        { value: 'ResponsabileChiarine', label: 'Chiarine' },
      ];
    }
    return [];
  }

  export function getPresenzeSheetOptions(role: string): { value: string; label: string }[] {
    if (role === 'ResponsabileMusici') {
      return [
        { value: 'Presenze Tamburi', label: 'Tamburi' },
        { value: 'Presenze Chiarine', label: 'Chiarine' },
      ];
    }
    if (role === 'ResponsabileGs') {
      return [
        { value: 'Presenze Sbandieratori', label: 'Sbandieratori' },
        { value: 'Presenze Tamburi', label: 'Tamburi' },
        { value: 'Presenze Chiarine', label: 'Chiarine' },
      ];
    }
    return [];
  }
