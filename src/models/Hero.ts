import mongoose from "mongoose";
import heroConfig from "../config/hero.config";
import bcryptjs from "bcryptjs";

const HeroSchema = new mongoose.Schema(heroConfig);

HeroSchema.pre('validate', async function (next) {
    
    const hash = await bcryptjs.hash(this.password, 10);
    this.password = hash;
    next();
});

const Hero = mongoose.model('Hero', HeroSchema);

export default Hero;