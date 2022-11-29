import { SOCIAL_TYPE } from '../../_enum/type.enum';

export type SocialLoginPayloadType = {
    socialType: SOCIAL_TYPE;
    socialKey: string;
    payload: string;
};

export interface GetSocialLoginPayloadInterface {
    getSocialPayload(dto: any): Promise<SocialLoginPayloadType>;
}
