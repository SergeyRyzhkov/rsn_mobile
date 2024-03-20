import { Suggestion, SuggestionQuery, SuggestionPayload, BOUNDS } from "./../models/DadataSuggetionModel";
import { BaseService } from "@/_core/service/BaseService";

export class AddressService extends BaseService {
  DEFAULT_URL = "https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/address";
  DEFAULT_HEADERS = { Authorization: "Token e9131afdaa36cb065382c3333c43e1844fa52a0e" };

  async getSuggestions(query: SuggestionQuery): Promise<Suggestion[]> {
    const count = query.count ?? 10;

    let payload: SuggestionPayload = {
      query: query.query,
      count,
    };

    payload = {
      ...payload,
      from_bound: { value: query.fromBound || "CITY" },
    };

    payload = {
      ...payload,
      to_bound: { value: query.toBound || "HOUSE" },
    };

    payload = {
      ...payload,
      locations_boost: query.locationOptions?.locationsBoost || [{ kladr_id: "78" }, { kladr_id: "47" }],
      locations: query.locationOptions?.locations || [{ kladr_id: "78" }, { kladr_id: "47" }],
    };

    const config = {
      headers: {
        ...this.DEFAULT_HEADERS,
      },
    };

    return (await this.apiRequest.post(this.DEFAULT_URL, payload, config)).data.suggestions;
  }
}
