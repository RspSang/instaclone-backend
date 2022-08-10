export const processHashtags = (caption: string) => {
  const hashtags = caption.match(
    /#[a-zA-Z0-9가-힇ㄱ-ㅎㅏ-ㅣぁ-ゔァ-ヴー々〆〤一-龥\w]+/g
  );
  return hashtags?.map((hashtag) => ({
    where: { hashtag },
    create: { hashtag },
  }));
};
