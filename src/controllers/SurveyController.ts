import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';
import { SurveyRepository } from '../repositories/SurveyRepository';

class SurveyController {
  async create(req: Request, res: Response): Promise<Response> {
    const { title, description } = req.body;

    const surveyRepository = getCustomRepository(SurveyRepository);
    const survey = surveyRepository.create({ title, description });

    await surveyRepository.save(survey);

    return res.status(201).json(survey); // Status: criando alguma coisa
  }

  async show(req: Request, res: Response): Promise<Response> {
    const surveyRepository = getCustomRepository(SurveyRepository);

    const all = await surveyRepository.find();

    return res.json(all);
  }
}

export { SurveyController };
