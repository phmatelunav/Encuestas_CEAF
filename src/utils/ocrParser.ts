export interface ParsedSurveyData {
  nombre: string;
  comuna: string;
  q1: string;
  q2: string;
  q3: string;
  q4: string;
  q5: string;
  q6: string;
  q7: string;
}

export function parseProgramDeRiegoOCR(ocrText: string): ParsedSurveyData {
  const result: ParsedSurveyData = {
    nombre: '',
    comuna: '',
    q1: '', q2: '', q3: '', q4: '', q5: '', q6: '', q7: ''
  };

  if (!ocrText) return result;

  const lines = ocrText.split('\n').map(l => l.trim()).filter(l => l.length > 0);
  let currentQuestion = 0;
  let q7Text: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].toLowerCase();

    // 1. Extraer Metadatos
    if (line.includes('nombre:')) {
      result.nombre = lines[i].split(/nombre:/i)[1]?.trim() || '';
      continue;
    }
    if (line.includes('comuna:')) {
      result.comuna = lines[i].split(/comuna:/i)[1]?.trim() || '';
      continue;
    }

    // 2. Extraer Pregunta actual basándose en los números
    const questionMatch = line.match(/^(\d+)[\.\)]/);
    if (questionMatch) {
      currentQuestion = parseInt(questionMatch[1], 10);
      continue;
    }

    // 3. Evaluar opciones para P1 - P6
    if (currentQuestion >= 1 && currentQuestion <= 6) {
      // Look for standard options a, b, c, d, e
      // A common OCR pattern for marked items is reading an X or O before or after the letter
      // e.g., "x a. Nada útil", "(x) a.", "O a.", "v b."
      const optionMarkRegex = /(?:[xXvVoO0]\s*)?(a|b|c|d|e)[\.\)](?:\s*[xXvVoO0])?/g;
      const matches = Array.from(lines[i].matchAll(optionMarkRegex));
      
      for (const match of matches) {
        const fullMatch = match[0].toLowerCase();
        const letter = match[1].toLowerCase();
        
        // Si la línea completa detectada tiene una marca clara (x, v, o, 0)
        const hasMark = /[xXvVoO0]/.test(fullMatch);
        
        if (hasMark) {
          const key = `q${currentQuestion}` as keyof ParsedSurveyData;
          // Devolver el formato esperado por el template ("a. Opción", etc.)
          // Mapeamos temporalmente solo la letra para luego buscar en el template
          result[key] = letter; 
        }
      }
    }

    // 4. Extraer texto libre P7
    if (currentQuestion === 7 && !line.match(/_|_{2,}/)) { // Ignorar las líneas de guiones bajos vacías
      q7Text.push(lines[i]);
    }
  }

  result.q7 = q7Text.join(' ').trim();
  return result;
}
