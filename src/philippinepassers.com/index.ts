import IScraper from '../interfaces/IScraper';
import axios from 'axios';
import cheerio from 'cheerio';
import StringHelper from '../common/StringHelpers';
import JsonWriter from '../common/JsonWriter';

class PhilippinePassersScraper implements IScraper {

  urlSource: string;
  $: any;

  constructor() {
    this.urlSource = 'https://www.philippinepassers.com/examination/results';
  }

  public scrape = async () => {
    const result = await axios.get(this.urlSource);
    this.$ = cheerio.load(result.data);

    const years = this.getSourcesPerYear();
    const exams = await this.getExamsPerYear(years);
    await this.getPassersForExam(exams);
  }

  private getSourcesPerYear = () => {
    const years: number[] = [];
    for (let year = 2000; year <= 2019; year++) {
      years.push(year)
    }
    return years;
  }

  private getExamsPerYear = async (years: number[]) => {
    const exams: any[] = [];
    for (let year of years) {
      const result = await axios.get(`${this.urlSource}/${year}`);
      const $ = cheerio.load(result.data);
      const examContainer: Cheerio = $('#page .container:nth-child(2) .row a');
      examContainer.map((index: number, element: CheerioElement) => {
        exams.push({
          exam: StringHelper.removeMonthAndYear(element.children[0].data),
          href: this.urlSource.replace('/examination/results', '') + element.attribs['href'],
          year
        });
      });
    }
    return exams;
  }

  private getPassersForExam = async (exams: any) => {
    const failedExams: any[] = [];

    // Loop Exam Links
    for (let exam of exams) {
      console.log('Getting ' + exam.exam + ' ' + exam.year);

      let passers: any[] = [];

      try {
        const result = await axios.get(exam.href);
        const $ = cheerio.load(result.data);
        const letterPaginations = $('.pagination').first().find('a');

        // Letter Pagination Links
        const letterPaginationLinks: string[] = [];
        letterPaginations.map((index: number, element: CheerioElement) => {
          letterPaginationLinks.push(`${this.urlSource.replace('/examination/results', '') + element.attribs['href']}`);
        });

        // Loop Pagination Per Letters
        for (const letterLink of letterPaginationLinks) {
          const letterRequestResult = await axios.get(letterLink);
          const $_letterHtml = cheerio.load(letterRequestResult.data);
          const pageLinks = $_letterHtml('.pagination').last().find('li');
          const finalLinksToCrawl = [letterLink];

          // Multiple Pages Per Letter
          if (pageLinks.length != 26) {
            const aTags = pageLinks.find('a');
            aTags.map(async (index, element) => {
              if (index != (aTags.length - 1)) {
                finalLinksToCrawl.push(element.attribs['href']);
              }
            });
          }

          // Loop Now Final Urls
          for (const finalLink of finalLinksToCrawl) {
            const result = await this.extractPassers(finalLink);
            passers = [
              ...passers,
              ...result
            ]
          }
        }

        // Write JSON per exam
        await JsonWriter.writeJson({
          ...exam,
          passers
        }, StringHelper.spaceToUnderscore(exam.exam + ' ' + exam.year))
      } catch (error) {
        failedExams.push(exam);
      }
    }

    // Write Failed Exams
    await JsonWriter.writeJson(failedExams, 'failedExams');
  }

  private extractPassers = async (link: string) => {
    const passers: any[] = [];
    const result = await axios.get(link);
    const $ = cheerio.load(result.data);
    const container = $('.card-outline-primary');
    const rows = container.find('span');
    rows.each((index, element) => {
      passers.push(element.children[0].data);
    });
    return passers;
  }

}

export default new PhilippinePassersScraper();
