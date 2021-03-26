import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';
import { SurveyRepository } from '../repositories/SurveyRepository';
import { SurveysUsersRepository } from '../repositories/SurveysUsersRepository';
import { UserRepository } from '../repositories/UserRepository';
import SendMailService from '../services/SendMailService';
import { resolve } from 'path';

class SendMailController {
  async execute(req: Request, res: Response): Promise<Response> {
    const { email, survey_id } = req.body;

    const usersRepository = getCustomRepository(UserRepository);
    const surveyRepository = getCustomRepository(SurveyRepository);
    const surveysUsersRepository = getCustomRepository(SurveysUsersRepository);

    const user = await usersRepository.findOne({ email });
    const survey = await surveyRepository.findOne({ id: survey_id });

    if (!user) {
      return res.status(400).json({
        error: 'User does not exists',
      });
    } else if (!survey) {
      return res.status(400).json({
        error: 'Survey does not exists',
      });
    }

    const npsPath = resolve(__dirname, '..', 'views', 'emails', 'npsMail.hbs');

    const variables = {
      name: user.name,
      title: survey.title,
      description: survey.description,
      user_id: user.id,
      link: process.env.URL_MAIL
    };

    const surveyUserAlreadyExists = await surveysUsersRepository.findOne({
      where: [{ user_id: user.id }, { value: null }],
      relations: ['user', 'survey']
    });

    if (surveyUserAlreadyExists) {
      await SendMailService.execute(email, variables, npsPath);
      return res.json(surveyUserAlreadyExists);
    }

    const surveyUser = surveysUsersRepository.create({
      user_id: user.id,
      survey_id
    });

    await surveysUsersRepository.save(surveyUser);
    await SendMailService.execute(email, variables, npsPath);

    return res.json(surveyUser);
  }
}

export { SendMailController };
