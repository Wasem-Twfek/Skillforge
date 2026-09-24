export type QuizQuestion = {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
};

export type PublicQuizQuestion = Omit<QuizQuestion, 'correctAnswer'>;

export function toPublicQuestions(value: unknown): PublicQuizQuestion[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.flatMap((question) => {
    if (typeof question !== 'object' || question === null) {
      return [];
    }

    const item = question as Partial<QuizQuestion>;
    if (
      typeof item.id !== 'string' ||
      typeof item.question !== 'string' ||
      !Array.isArray(item.options)
    ) {
      return [];
    }

    return [{
      id: item.id,
      question: item.question,
      options: item.options.map(String),
    }];
  });
}
