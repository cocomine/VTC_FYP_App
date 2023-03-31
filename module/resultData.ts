/**
 * @description data is the result of the API call
 */
type ResultData = {
  /**
   * @description id is the id of the event
   */
  ID: number;
  /**
   * @description name is the name of the event
   */
  name: string;
  /**
   * @description summary is the summary of the event
   */
  summary: string;
  /**
   * @description latitude is the location of the event
   */
  latitude: number;
  /**
   * @description longitude is the location of the event
   */
  longitude: number;
  /**
   * @description thumbnail is the thumbnail of the event
   */
  thumbnail: string;
  /**
   * @description rate is the rate of the event
   */
  rate: number;
  /**
   * @description total is the total review of the event
   */
  total:number;
}

/**
 * @description ResultData is the type of the data returned by the API
 */
type respondData = {
  /**
   * @description code is the status code of the response
   */
  code: number;
  /**
   * @description data is the result of the API call
   */
  data: ResultData[];
}

export type { ResultData, respondData };
