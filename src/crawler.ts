import ExamScraper from './exams/ExamScraper';
import JsonWriter from './common/JsonWriter';
import PhilippinePassers from './philippinepassers.com';
import dotenv from 'dotenv';

(async () => {
     await dotenv.config();

    // Exams
    // const examsResults = await ExamScraper.scrape();
    // JsonWriter.writeJson(examsResults, 'exams');
    const philippinePassersResult = await PhilippinePassers.scrape();

})();
