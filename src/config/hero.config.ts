export default {
    nome_real: {
        type: String,
        require: true,
        select: false,
    },
    password: {
        type: String,
        require: true,
        select: false,
    },
    codinome: {
        type: String,
        require: true,
        unique: true,
    },
    tipo_desastre: {
        type: [String],
        enum: ["assalto a bancos", "monstros gigantes", "desastres naturais"],
        require: true,
        lowercase: true,
    },
    cidades: {
        type: [String],
        enum: ["New York", "Rio de Janeiro", "Tókio"],
        require: true,
    },
    trabalho_equipe: {
        type: String,
        enum: ['sim', 'não', 'indiferente'],
        default: 'indiferente',
        require: true,
    }
}