import Architecute2019 from './architecture/2019';
import ExamScraper from './exams/ExamScraper';

(async () => {
    
    // const archi2019 = await Architecute2019.scrape();
    const examScraper = await ExamScraper.scrape();
    console.log(examScraper);
})();