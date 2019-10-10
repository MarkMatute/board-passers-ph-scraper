import ExamScraper from './exams/ExamScraper';
import JsonWriter from './common/JsonWriter';

(async () => {

    // Exams
    const examsResults = await ExamScraper.scrape();
    JsonWriter.writeJson(examsResults, 'exams');

})();
