export const getBlacklistTokenKey = (jti: string) => {
  return `Block_token_${jti}`;
};
