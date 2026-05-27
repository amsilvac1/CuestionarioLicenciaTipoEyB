import { preguntas as preguntasLicencia } from './preguntas'
import { preguntasMineria } from './mineriaDatos'
import { preguntasSistemasColaborativos } from './sistemasColaborativos'

function preguntasLicenciaPorTipo(tipo) {
  return preguntasLicencia.filter((pregunta) => {
    const base = pregunta.id >= 1 && pregunta.id <= 139
    const bloqueE = pregunta.id >= 140 && pregunta.id <= 164
    const bloqueB = pregunta.id >= 165 && pregunta.id <= 178

    if (tipo === 'E') return base || bloqueE
    return base || bloqueB
  })
}

const licenciaQuizzes = {
  B: {
    key: 'B',
    title: 'Licencia tipo B',
    subtitle: 'Particular',
    description: 'Base de preguntas con el bloque para licencia particular.',
    questions: preguntasLicenciaPorTipo('B'),
  },
  E: {
    key: 'E',
    title: 'Licencia tipo E',
    subtitle: 'Profesional',
    description: 'Base de preguntas con el bloque para licencia profesional.',
    questions: preguntasLicenciaPorTipo('E'),
  },
}

const novenoQuizzes = {
  mineria: {
    key: 'mineria',
    title: 'Minería de datos',
    subtitle: 'CRISP-DM y APIs',
    description: 'Cuestionario del 9no semestre sobre minería de datos.',
    questions: preguntasMineria,
  },
  sistemas: {
    key: 'sistemas',
    title: 'Sistemas colaborativos',
    subtitle: 'Agentes, búsqueda y lógica',
    description: 'Cuestionario del 9no semestre sobre sistemas colaborativos.',
    questions: preguntasSistemasColaborativos,
  },
}

export const quizFamilies = {
  licencia: {
    key: 'licencia',
    title: 'Licencia de conducir',
    description: 'Práctica de señales, normas y conducción.',
    defaultQuizKey: 'B',
    options: [
      {
        key: 'B',
        title: 'Tipo B',
        subtitle: 'Particular',
        description: 'Pregunta base + bloque de licencia particular.',
      },
      {
        key: 'E',
        title: 'Tipo E',
        subtitle: 'Profesional',
        description: 'Pregunta base + bloque de licencia profesional.',
      },
    ],
    getQuiz(quizKey) {
      return licenciaQuizzes[quizKey] ?? licenciaQuizzes.B
    },
  },
  '9no': {
    key: '9no',
    title: '9no semestre',
    description: 'Minería de datos y sistemas colaborativos.',
    defaultQuizKey: 'mineria',
    options: [
      {
        key: 'mineria',
        title: 'Minería de datos',
        subtitle: 'CRISP-DM y APIs',
        description: 'Preguntas sobre análisis, APIs y metodología CRISP-DM.',
      },
      {
        key: 'sistemas',
        title: 'Sistemas colaborativos',
        subtitle: 'Agentes y lógica',
        description: 'Preguntas sobre agentes, búsqueda, lógica y PSR.',
      },
    ],
    getQuiz(quizKey) {
      return novenoQuizzes[quizKey] ?? novenoQuizzes.mineria
    },
  },
}

export const familyOptions = [
  {
    key: 'licencia',
    title: 'Licencia de conducir',
    subtitle: 'Tipos B y E',
    description: 'Señales de tránsito y normativa vial del Ecuador.',
  },
  {
    key: '9no',
    title: 'Computación',
    subtitle: 'Minería de Datos y Sistemas Colaborativos',
    description: 'Cuestionarios técnicos del semestre.',
  },
]

export function getQuizFamily(familyKey) {
  return quizFamilies[familyKey] ?? quizFamilies.licencia
}
