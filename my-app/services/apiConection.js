const BASE_URL = 'https://localhost:7094';

export const EnumUserRole = {
  Comum: 1,
  Empresarial: 2,
  Policial: 3,
};

export const EnumTheftVehicleCondition = {
  Roubo: 'Roubo',
  Furto: 'Furto',
  None: 'Nenhum',
};

export const EnumTypeFuelVehicle = {
  Diesel: 'Diesel',
  Gasolina: 'Gasolina',
  Gnv: 'GNV',
  Eletrico: 'Elétrico',
  Etanol: 'Etanol',
  Flex: 'Flex',
};

export const EnumDataVehicleCondition = {
  Valid: 'Válido',
  Old: 'Antigo',
  Unavailable: 'Indisponível',
};

async function getErrorFromResponse(res){
  try{ const j = await res.json(); return j?.message || j?.[0] || `${res.status} ${res.statusText}`; }
  catch(_){ try{ return await res.text(); }catch(__){ return `${res.status} ${res.statusText}`; } }
}

export async function apiReportRegistration({ userId, plate, file }){
  try{
    const form = new FormData();
    if (userId) form.append('UserId', String(userId));
    if (plate) form.append('Plate', plate);
    if (file) form.append('File', file);
    const endpoints = [ `${BASE_URL}/api/ReportRegistration` ];
    let lastErr = 'Falha ao registrar.';
    for (const url of endpoints){
      try{
        const res = await fetch(url, { method: 'POST', body: form });
        if (res.ok){ const content = await res.json(); return { isSuccess: true, content, listMessageErrors: [] }; }
        lastErr = await getErrorFromResponse(res);
      }catch(err){ lastErr = err?.message || lastErr; }
    }
    return { isSuccess: false, content: null, listMessageErrors: [String(lastErr)] };
  }catch(error){
    return { isSuccess: false, content: null, listMessageErrors: [error?.message || 'Erro de rede.'] };
  }
}

function brToIsoDateOnly(s){
  const m = /^([0-2]\d|3[01])\/(0\d|1[0-2])\/(\d{4})$/.exec(s || '');
  if (!m) return null;
  const d = m[1], mo = m[2], y = m[3];
  return `${y}-${mo}-${d}`;
}

export async function apiListReports({ startDate, endDate }){
  const startIso = brToIsoDateOnly(startDate);
  const endIso = brToIsoDateOnly(endDate);
  const params = new URLSearchParams({ startDate: startIso || startDate, endDate: endIso || endDate }).toString();
  const endpoints = [
    `${BASE_URL}/api/Reports/range?${params}`,
    `${BASE_URL}/api/reports/range?${params}`,
  ];
  let lastErr = 'Falha ao consultar relatórios.';
  for (const url of endpoints){
    try{
      const res = await fetch(url);
      if (res.ok){ const content = await res.json(); return { isSuccess: true, content, listMessageErrors: [] }; }
      lastErr = await getErrorFromResponse(res);
    }catch(err){ lastErr = err?.message || lastErr; }
  }
  return { isSuccess: false, content: null, listMessageErrors: [String(lastErr)] };
}

export async function apiSearchPlate(plate){
  const endpoints = [
    `${BASE_URL}/api/Vehicles/search?plate=${encodeURIComponent(plate)}`,
    `${BASE_URL}/api/vehicles/search?plate=${encodeURIComponent(plate)}`,
  ];
  let lastErr = 'Falha ao buscar placa.';
  for (const url of endpoints){
    try{
      const res = await fetch(url);
      if (res.ok){ const content = await res.json(); return { isSuccess: true, content, listMessageErrors: [] }; }
      lastErr = await getErrorFromResponse(res);
    }catch(err){ lastErr = err?.message || lastErr; }
  }
  return { isSuccess: false, content: null, listMessageErrors: [String(lastErr)] };
}

export async function apiGenerateReport({
  userId,
  initialDate,
  finalDate,
  listColor = [],
  wrecked = false,
  judicialRestriction = false,
  auction = false,
  listModel = [],
  listBrand = [],
  listMunicipality = [],
  listState = [],
  theftVehicleCondition = EnumTheftVehicleCondition.None,
}){
  try{
    function mapTheft(v){ if (v === EnumTheftVehicleCondition.Roubo) return 1; if (v === EnumTheftVehicleCondition.Furto) return 2; return 0; }
    const payload = {
      userId,
      initialDate,
      finalDate,
      listColor,
      wrecked,
      judicialRestriction,
      auction,
      listModel,
      listBrand,
      listMunicipality,
      listState,
      theftVehicleCondition: mapTheft(theftVehicleCondition),
    };
    const endpoints = [ `${BASE_URL}/api/DynamicReport/generate` ];
    let lastErr = 'Falha ao gerar PDF.';
    for (const url of endpoints){
      try{
        const res = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
        if (res.ok){
          const blob = await res.blob();
          const cd = res.headers.get('Content-Disposition') || '';
          let filename = 'relatorio-dinamico.pdf';
          const m = /filename\*=UTF-8''([^;]+)|filename="([^"]+)"/i.exec(cd);
          if (m){ filename = decodeURIComponent(m[1] || m[2] || filename); }
          return { isSuccess: true, content: { blob, filename }, listMessageErrors: [] };
        }
        lastErr = await getErrorFromResponse(res);
      }catch(err){ lastErr = err?.message || lastErr; }
    }
    return { isSuccess: false, content: null, listMessageErrors: [String(lastErr)] };
  }catch(error){
    return { isSuccess: false, content: null, listMessageErrors: [error?.message || 'Erro de rede.'] };
  }
}
