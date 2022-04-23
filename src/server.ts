import App from "./app";
import DataBase from "./database/dbHeros";
import ModelHero from "./models/Hero";


const db = new DataBase()
const app = new App().express;
const PORT = process.env.PORT || 3000;

app.listen(PORT, async() =>{
    await db.connectDB();
    if(await db.isEmpty()){
        console.log("Inserindo Dados!")
        const heros = require("../herosList.json");
        await ModelHero.insertMany(heros);
    }
    console.log(`Server online na porta ${PORT}.`);
})