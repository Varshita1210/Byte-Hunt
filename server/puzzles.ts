export interface ClueData {
  clueId: string;
  originalPosition: number;
  type: 'picture-puzzle' | 'tech-question' | 'rebus-puzzle' | 'scrambled-word' | 'riddle' | 'missing-letter' | 'logic-puzzle' | 'word-puzzle' | 'match-it';
  typeDisplay: string;
  question: string;
  correctAnswer: string;
  requiredLetter: string;
  acceptedAnswers: string[];
  visualAssetKey?: string;
  hint?: string;
  missingLetterPattern?: string;
  scrambledLetters?: string;
  matchPairs?: { left: string; right: string }[];
}

export interface PuzzleData {
  puzzleId: string;
  targetWord: string;
  targetLength: number;
  sourceBooklet: 'Booklet 1' | 'Booklet 2 (Vol. 2)';
  sourceRound: number;
  clues: ClueData[];
  description?: string;
}

export const ALL_PUZZLES: PuzzleData[] = [
  // ==================== BOOKLET 1 ====================
  {
    puzzleId: 'puzzle-b1-01',
    targetWord: 'SOFTWARE',
    targetLength: 8,
    sourceBooklet: 'Booklet 1',
    sourceRound: 1,
    clues: [
      {
        clueId: 'b1-01-c1',
        originalPosition: 1,
        type: 'picture-puzzle',
        typeDisplay: 'PICTURE PUZZLE',
        question: 'Name this powerful machine that hosts websites and files for many users. (6 letters)',
        correctAnswer: 'SERVER',
        requiredLetter: 'S',
        acceptedAnswers: ['SERVER', 'SERVERS'],
        visualAssetKey: 'server',
        hint: 'It operates in data centres and serves client requests.'
      },
      {
        clueId: 'b1-01-c2',
        originalPosition: 2,
        type: 'tech-question',
        typeDisplay: 'TECH QUESTION',
        question: 'Windows, Linux and macOS are examples of this essential program that manages a computer’s hardware and runs your apps. What is it called?',
        correctAnswer: 'OPERATING SYSTEM',
        requiredLetter: 'O',
        acceptedAnswers: ['OPERATING SYSTEM', 'OS'],
        hint: 'Abbreviated as OS.'
      },
      {
        clueId: 'b1-01-c3',
        originalPosition: 3,
        type: 'rebus-puzzle',
        typeDisplay: 'REBUS PUZZLE',
        question: 'Join the two pictures to form a network-security word. (8 letters)',
        correctAnswer: 'FIREWALL',
        requiredLetter: 'F',
        acceptedAnswers: ['FIREWALL'],
        visualAssetKey: 'firewall',
        hint: 'FIRE + WALL'
      },
      {
        clueId: 'b1-01-c4',
        originalPosition: 4,
        type: 'scrambled-word',
        typeDisplay: 'SCRAMBLED WORD',
        question: 'Rearrange these letters to form a technical word: N A M R E T L I',
        scrambledLetters: 'N A M R E T L I',
        correctAnswer: 'TERMINAL',
        requiredLetter: 'T',
        acceptedAnswers: ['TERMINAL'],
        hint: 'A text window where you type commands to the computer.'
      },
      {
        clueId: 'b1-01-c5',
        originalPosition: 5,
        type: 'rebus-puzzle',
        typeDisplay: 'REBUS PUZZLE',
        question: 'Join the two pictures to form something you see in every browser. (7 letters)',
        correctAnswer: 'WEBPAGE',
        requiredLetter: 'W',
        acceptedAnswers: ['WEBPAGE', 'WEB PAGE'],
        visualAssetKey: 'webpage',
        hint: 'WEB + PAGE'
      },
      {
        clueId: 'b1-01-c6',
        originalPosition: 6,
        type: 'riddle',
        typeDisplay: 'RIDDLE',
        question: 'I am a step-by-step set of instructions for solving a problem. Every program is built on me. What am I?',
        correctAnswer: 'ALGORITHM',
        requiredLetter: 'A',
        acceptedAnswers: ['ALGORITHM'],
        hint: 'Named after Al-Khwarizmi, central to computer science.'
      },
      {
        clueId: 'b1-01-c7',
        originalPosition: 7,
        type: 'missing-letter',
        typeDisplay: 'MISSING LETTER',
        question: 'Find the missing letter and name the complete word: R O ? T E R\nWhich letter is missing? Hint: I forward data between different networks.',
        missingLetterPattern: 'R O ? T E R',
        correctAnswer: 'ROUTER',
        requiredLetter: 'R',
        acceptedAnswers: ['ROUTER'],
        hint: 'The missing letter is U.'
      },
      {
        clueId: 'b1-01-c8',
        originalPosition: 8,
        type: 'riddle',
        typeDisplay: 'RIDDLE',
        question: '“404 Not Found” is an example of me. I appear when a request fails or something goes wrong. What am I?',
        correctAnswer: 'ERROR',
        requiredLetter: 'E',
        acceptedAnswers: ['ERROR'],
        hint: 'A mistake or fault condition in software.'
      }
    ]
  },
  {
    puzzleId: 'puzzle-b1-02',
    targetWord: 'ENCRYPTION',
    targetLength: 10,
    sourceBooklet: 'Booklet 1',
    sourceRound: 2,
    clues: [
      {
        clueId: 'b1-02-c1',
        originalPosition: 1,
        type: 'picture-puzzle',
        typeDisplay: 'PICTURE PUZZLE',
        question: 'Name this message that is sent and received using an address containing the @ symbol. (5 letters)',
        correctAnswer: 'EMAIL',
        requiredLetter: 'E',
        acceptedAnswers: ['EMAIL', 'E-MAIL'],
        visualAssetKey: 'email',
        hint: 'Electronic mail.'
      },
      {
        clueId: 'b1-02-c2',
        originalPosition: 2,
        type: 'rebus-puzzle',
        typeDisplay: 'REBUS PUZZLE',
        question: 'Join the two pictures to form a word for computers connected together to share data. (7 letters)',
        correctAnswer: 'NETWORK',
        requiredLetter: 'N',
        acceptedAnswers: ['NETWORK'],
        visualAssetKey: 'network',
        hint: 'NET + WORK (briefcase)'
      },
      {
        clueId: 'b1-02-c3',
        originalPosition: 3,
        type: 'tech-question',
        typeDisplay: 'TECH QUESTION',
        question: 'Which three-letter abbreviation stands for the “brain” of a computer, the part that executes instructions?',
        correctAnswer: 'CPU',
        requiredLetter: 'C',
        acceptedAnswers: ['CPU', 'CENTRAL PROCESSING UNIT'],
        hint: 'Central Processing Unit.'
      },
      {
        clueId: 'b1-02-c4',
        originalPosition: 4,
        type: 'riddle',
        typeDisplay: 'RIDDLE',
        question: 'I am fast, temporary memory. The moment the power goes off, I forget everything. What am I?',
        correctAnswer: 'RAM',
        requiredLetter: 'R',
        acceptedAnswers: ['RAM', 'RANDOM ACCESS MEMORY'],
        hint: 'Random Access Memory.'
      },
      {
        clueId: 'b1-02-c5',
        originalPosition: 5,
        type: 'picture-puzzle',
        typeDisplay: 'PICTURE PUZZLE',
        question: 'Name this popular video-sharing platform whose icon looks like this. (7 letters)',
        correctAnswer: 'YOUTUBE',
        requiredLetter: 'Y',
        acceptedAnswers: ['YOUTUBE'],
        visualAssetKey: 'youtube',
        hint: 'Google-owned platform with a red play button.'
      },
      {
        clueId: 'b1-02-c6',
        originalPosition: 6,
        type: 'tech-question',
        typeDisplay: 'TECH QUESTION',
        question: 'What secret word or phrase do you type, along with a username, to log in to an account?',
        correctAnswer: 'PASSWORD',
        requiredLetter: 'P',
        acceptedAnswers: ['PASSWORD', 'PASSCODE'],
        hint: 'Used for authentication alongside your username.'
      },
      {
        clueId: 'b1-02-c7',
        originalPosition: 7,
        type: 'scrambled-word',
        typeDisplay: 'SCRAMBLED WORD',
        question: 'Rearrange these letters to form a technical word: B A L E T',
        scrambledLetters: 'B A L E T',
        correctAnswer: 'TABLE',
        requiredLetter: 'T',
        acceptedAnswers: ['TABLE'],
        hint: 'Rows and columns that store records in a database.'
      },
      {
        clueId: 'b1-02-c8',
        originalPosition: 8,
        type: 'tech-question',
        typeDisplay: 'TECH QUESTION',
        question: 'What are the small clickable pictures on your desktop or phone screen called?',
        correctAnswer: 'ICON',
        requiredLetter: 'I',
        acceptedAnswers: ['ICON', 'ICONS'],
        hint: 'Graphical representations of apps or files.'
      },
      {
        clueId: 'b1-02-c9',
        originalPosition: 9,
        type: 'logic-puzzle',
        typeDisplay: 'LOGIC PUZZLE',
        question: 'The computing cycle: INPUT → PROCESS → ? Complete the basic cycle of computing: what comes after Process? (It is the result you see or hear.)',
        correctAnswer: 'OUTPUT',
        requiredLetter: 'O',
        acceptedAnswers: ['OUTPUT'],
        hint: 'The information delivered to the user.'
      },
      {
        clueId: 'b1-02-c10',
        originalPosition: 10,
        type: 'scrambled-word',
        typeDisplay: 'SCRAMBLED WORD',
        question: 'Rearrange these letters to form a technical word: T E P A D O N',
        scrambledLetters: 'T E P A D O N',
        correctAnswer: 'NOTEPAD',
        requiredLetter: 'N',
        acceptedAnswers: ['NOTEPAD'],
        hint: 'A basic text editor that comes with Windows.'
      }
    ]
  },
  {
    puzzleId: 'puzzle-b1-03',
    targetWord: 'AUTOMATION',
    targetLength: 10,
    sourceBooklet: 'Booklet 1',
    sourceRound: 3,
    clues: [
      {
        clueId: 'b1-03-c1',
        originalPosition: 1,
        type: 'tech-question',
        typeDisplay: 'TECH QUESTION',
        question: 'Which two-letter abbreviation stands for machines that can learn and make decisions like humans?',
        correctAnswer: 'AI',
        requiredLetter: 'A',
        acceptedAnswers: ['AI', 'ARTIFICIAL INTELLIGENCE'],
        hint: 'Artificial Intelligence.'
      },
      {
        clueId: 'b1-03-c2',
        originalPosition: 2,
        type: 'picture-puzzle',
        typeDisplay: 'PICTURE PUZZLE',
        question: 'What three-letter name is given to the plug and port type used by this portable drive? (3 letters)',
        correctAnswer: 'USB',
        requiredLetter: 'U',
        acceptedAnswers: ['USB', 'USB DRIVE'],
        visualAssetKey: 'usb',
        hint: 'Universal Serial Bus.'
      },
      {
        clueId: 'b1-03-c3',
        originalPosition: 3,
        type: 'riddle',
        typeDisplay: 'RIDDLE',
        question: 'You tap, swipe and pinch on me, and I respond to your fingers. What am I?',
        correctAnswer: 'TOUCHSCREEN',
        requiredLetter: 'T',
        acceptedAnswers: ['TOUCHSCREEN', 'TOUCH SCREEN'],
        hint: 'A display that acts as an input device.'
      },
      {
        clueId: 'b1-03-c4',
        originalPosition: 4,
        type: 'tech-question',
        typeDisplay: 'TECH QUESTION',
        question: 'Programs whose code is free for anyone to view, modify and share are called ____ ____.',
        correctAnswer: 'OPEN SOURCE',
        requiredLetter: 'O',
        acceptedAnswers: ['OPEN SOURCE', 'OPENSOURCE'],
        hint: 'Contrasted with proprietary software.'
      },
      {
        clueId: 'b1-03-c5',
        originalPosition: 5,
        type: 'rebus-puzzle',
        typeDisplay: 'REBUS PUZZLE',
        question: 'Join the two pictures to form the main circuit board inside a computer. (11 letters)',
        correctAnswer: 'MOTHERBOARD',
        requiredLetter: 'M',
        acceptedAnswers: ['MOTHERBOARD'],
        visualAssetKey: 'motherboard',
        hint: 'MOTHER + BOARD'
      },
      {
        clueId: 'b1-03-c6',
        originalPosition: 6,
        type: 'missing-letter',
        typeDisplay: 'MISSING LETTER',
        question: 'Find the missing letter and name the complete word: A N T ? V I R U S\nWhich letter is missing? Hint: it protects your computer against malware.',
        missingLetterPattern: 'A N T ? V I R U S',
        correctAnswer: 'ANTIVIRUS',
        requiredLetter: 'A',
        acceptedAnswers: ['ANTIVIRUS'],
        hint: 'Missing letter is I.'
      },
      {
        clueId: 'b1-03-c7',
        originalPosition: 7,
        type: 'riddle',
        typeDisplay: 'RIDDLE',
        question: 'I look like a harmless gift but secretly let attackers in. My name comes from an ancient wooden horse. What am I?',
        correctAnswer: 'TROJAN',
        requiredLetter: 'T',
        acceptedAnswers: ['TROJAN', 'TROJAN HORSE'],
        hint: 'Trojan horse malware.'
      },
      {
        clueId: 'b1-03-c8',
        originalPosition: 8,
        type: 'riddle',
        typeDisplay: 'RIDDLE',
        question: 'Every email you receive lands in me first. What am I?',
        correctAnswer: 'INBOX',
        requiredLetter: 'I',
        acceptedAnswers: ['INBOX'],
        hint: 'The main folder where incoming mail arrives.'
      },
      {
        clueId: 'b1-03-c9',
        originalPosition: 9,
        type: 'word-puzzle',
        typeDisplay: 'WORD PUZZLE',
        question: 'If you are connected to the internet right now, you are ______.',
        correctAnswer: 'ONLINE',
        requiredLetter: 'O',
        acceptedAnswers: ['ONLINE'],
        hint: 'Opposite of offline.'
      },
      {
        clueId: 'b1-03-c10',
        originalPosition: 10,
        type: 'picture-puzzle',
        typeDisplay: 'PICTURE PUZZLE',
        question: 'What do we call this alert that pops up on your phone when something new arrives? (12 letters)',
        correctAnswer: 'NOTIFICATION',
        requiredLetter: 'N',
        acceptedAnswers: ['NOTIFICATION', 'NOTIFICATIONS'],
        visualAssetKey: 'notification',
        hint: 'Pop-up alert with sound or banner.'
      }
    ]
  },
  {
    puzzleId: 'puzzle-b1-04',
    targetWord: 'BLOCKCHAIN',
    targetLength: 10,
    sourceBooklet: 'Booklet 1',
    sourceRound: 4,
    clues: [
      {
        clueId: 'b1-04-c1',
        originalPosition: 1,
        type: 'picture-puzzle',
        typeDisplay: 'PICTURE PUZZLE',
        question: 'Name this tiny creature whose name programmers use for a flaw in their code. (3 letters)',
        correctAnswer: 'BUG',
        requiredLetter: 'B',
        acceptedAnswers: ['BUG', 'BUGS'],
        visualAssetKey: 'bug',
        hint: 'Famously traced back to an insect trapped in a Mark II relay.'
      },
      {
        clueId: 'b1-04-c2',
        originalPosition: 2,
        type: 'tech-question',
        typeDisplay: 'TECH QUESTION',
        question: 'Which free system with a penguin as its mascot runs most of the world’s servers?',
        correctAnswer: 'LINUX',
        requiredLetter: 'L',
        acceptedAnswers: ['LINUX'],
        hint: 'Created by Linus Torvalds with Tux the penguin.'
      },
      {
        clueId: 'b1-04-c3',
        originalPosition: 3,
        type: 'tech-question',
        typeDisplay: 'TECH QUESTION',
        question: 'Microsoft Word, Excel and PowerPoint together form which productivity suite?',
        correctAnswer: 'OFFICE',
        requiredLetter: 'O',
        acceptedAnswers: ['OFFICE', 'MS OFFICE', 'MICROSOFT OFFICE'],
        hint: 'Microsoft Office / 365.'
      },
      {
        clueId: 'b1-04-c4',
        originalPosition: 4,
        type: 'picture-puzzle',
        typeDisplay: 'PICTURE PUZZLE',
        question: 'Name this symbol for storing and accessing files over the internet instead of on your own device. (5 letters)',
        correctAnswer: 'CLOUD',
        requiredLetter: 'C',
        acceptedAnswers: ['CLOUD'],
        visualAssetKey: 'cloud',
        hint: 'Cloud computing and storage.'
      },
      {
        clueId: 'b1-04-c5',
        originalPosition: 5,
        type: 'rebus-puzzle',
        typeDisplay: 'REBUS PUZZLE',
        question: 'Join the two pictures to form the device you type on. (8 letters)',
        correctAnswer: 'KEYBOARD',
        requiredLetter: 'K',
        acceptedAnswers: ['KEYBOARD'],
        visualAssetKey: 'keyboard',
        hint: 'KEY + BOARD'
      },
      {
        clueId: 'b1-04-c6',
        originalPosition: 6,
        type: 'missing-letter',
        typeDisplay: 'MISSING LETTER',
        question: 'Find the missing letter and name the complete word: C ? M P I L E R\nWhich letter is missing? Hint: it translates source code into machine language.',
        missingLetterPattern: 'C ? M P I L E R',
        correctAnswer: 'COMPILER',
        requiredLetter: 'C',
        acceptedAnswers: ['COMPILER'],
        hint: 'Missing letter is O.'
      },
      {
        clueId: 'b1-04-c7',
        originalPosition: 7,
        type: 'tech-question',
        typeDisplay: 'TECH QUESTION',
        question: 'Which four-letter language gives web pages their structure: headings, links and images?',
        correctAnswer: 'HTML',
        requiredLetter: 'H',
        acceptedAnswers: ['HTML'],
        hint: 'HyperText Markup Language.'
      },
      {
        clueId: 'b1-04-c8',
        originalPosition: 8,
        type: 'scrambled-word',
        typeDisplay: 'SCRAMBLED WORD',
        question: 'Rearrange these letters to form a technical word: D R O I D N A',
        scrambledLetters: 'D R O I D N A',
        correctAnswer: 'ANDROID',
        requiredLetter: 'A',
        acceptedAnswers: ['ANDROID'],
        hint: 'Google’s mobile system with a little green mascot.'
      },
      {
        clueId: 'b1-04-c9',
        originalPosition: 9,
        type: 'riddle',
        typeDisplay: 'RIDDLE',
        question: 'I am a worldwide network that connects billions of computers and phones so you can browse, stream and chat. What am I?',
        correctAnswer: 'INTERNET',
        requiredLetter: 'I',
        acceptedAnswers: ['INTERNET'],
        hint: 'The global system of interconnected networks.'
      },
      {
        clueId: 'b1-04-c10',
        originalPosition: 10,
        type: 'logic-puzzle',
        typeDisplay: 'LOGIC PUZZLE',
        question: 'Basic logic gates: AND , OR , ? Complete the three basic logic gates: AND, OR, ______.',
        correctAnswer: 'NOT',
        requiredLetter: 'N',
        acceptedAnswers: ['NOT'],
        hint: 'Inverts the binary input.'
      }
    ]
  },
  {
    puzzleId: 'puzzle-b1-05',
    targetWord: 'ROBOTICS',
    targetLength: 8,
    sourceBooklet: 'Booklet 1',
    sourceRound: 5,
    clues: [
      {
        clueId: 'b1-05-c1',
        originalPosition: 1,
        type: 'riddle',
        typeDisplay: 'RIDDLE',
        question: 'My contents are “Read-Only”. I permanently store the startup instructions of a computer. What is my three-letter name?',
        correctAnswer: 'ROM',
        requiredLetter: 'R',
        acceptedAnswers: ['ROM', 'READ ONLY MEMORY'],
        hint: 'Read-Only Memory.'
      },
      {
        clueId: 'b1-05-c2',
        originalPosition: 2,
        type: 'scrambled-word',
        typeDisplay: 'SCRAMBLED WORD',
        question: 'Rearrange these letters to form a technical word: N I F E L O F',
        scrambledLetters: 'N I F E L O F',
        correctAnswer: 'OFFLINE',
        requiredLetter: 'O',
        acceptedAnswers: ['OFFLINE'],
        hint: 'Not connected to the internet.'
      },
      {
        clueId: 'b1-05-c3',
        originalPosition: 3,
        type: 'rebus-puzzle',
        typeDisplay: 'REBUS PUZZLE',
        question: 'Join the two pictures to form a wireless technology used by earphones and speakers. (9 letters)',
        correctAnswer: 'BLUETOOTH',
        requiredLetter: 'B',
        acceptedAnswers: ['BLUETOOTH'],
        visualAssetKey: 'bluetooth',
        hint: 'BLUE + TOOTH'
      },
      {
        clueId: 'b1-05-c4',
        originalPosition: 4,
        type: 'tech-question',
        typeDisplay: 'TECH QUESTION',
        question: 'Chrome, Firefox, Edge and ______ are all web browsers. Its name is also a musical drama.',
        correctAnswer: 'OPERA',
        requiredLetter: 'O',
        acceptedAnswers: ['OPERA'],
        hint: 'Web browser named after theatrical music.'
      },
      {
        clueId: 'b1-05-c5',
        originalPosition: 5,
        type: 'picture-puzzle',
        typeDisplay: 'PICTURE PUZZLE',
        question: 'Name this touchscreen device, bigger than a phone but smaller than a laptop. (6 letters)',
        correctAnswer: 'TABLET',
        requiredLetter: 'T',
        acceptedAnswers: ['TABLET', 'IPAD'],
        visualAssetKey: 'tablet',
        hint: 'Slate mobile computer with a touch display.'
      },
      {
        clueId: 'b1-05-c6',
        originalPosition: 6,
        type: 'picture-puzzle',
        typeDisplay: 'PICTURE PUZZLE',
        question: 'Name this private-browsing mode that does not save your history. (9 letters)',
        correctAnswer: 'INCOGNITO',
        requiredLetter: 'I',
        acceptedAnswers: ['INCOGNITO'],
        visualAssetKey: 'incognito',
        hint: 'Masked detective or hat-and-glasses mode.'
      },
      {
        clueId: 'b1-05-c7',
        originalPosition: 7,
        type: 'tech-question',
        typeDisplay: 'TECH QUESTION',
        question: 'What is the small blinking line or arrow that shows where you will type or click?',
        correctAnswer: 'CURSOR',
        requiredLetter: 'C',
        acceptedAnswers: ['CURSOR', 'POINTER'],
        hint: 'Indicator on a screen indicating focus.'
      },
      {
        clueId: 'b1-05-c8',
        originalPosition: 8,
        type: 'riddle',
        typeDisplay: 'RIDDLE',
        question: 'I am unwanted junk email that clutters your account. What am I?',
        correctAnswer: 'SPAM',
        requiredLetter: 'S',
        acceptedAnswers: ['SPAM'],
        hint: 'Unsolicited bulk email message.'
      }
    ]
  },
  {
    puzzleId: 'puzzle-b1-06',
    targetWord: 'COMPUTING',
    targetLength: 9,
    sourceBooklet: 'Booklet 1',
    sourceRound: 6,
    clues: [
      {
        clueId: 'b1-06-c1',
        originalPosition: 1,
        type: 'picture-puzzle',
        typeDisplay: 'PICTURE PUZZLE',
        question: 'Besides being a biscuit, what is the small data file a website saves in your browser? (6 letters)',
        correctAnswer: 'COOKIE',
        requiredLetter: 'C',
        acceptedAnswers: ['COOKIE', 'COOKIES'],
        visualAssetKey: 'cookie',
        hint: 'HTTP state management data stored locally.'
      },
      {
        clueId: 'b1-06-c2',
        originalPosition: 2,
        type: 'tech-question',
        typeDisplay: 'TECH QUESTION',
        question: 'Internet backbone cables carry data as pulses of light through thin glass strands called ______ ______.',
        correctAnswer: 'OPTICAL FIBER',
        requiredLetter: 'O',
        acceptedAnswers: ['OPTICAL FIBER', 'OPTICAL FIBRE', 'FIBER OPTIC'],
        hint: 'Carries light through strands of silica glass.'
      },
      {
        clueId: 'b1-06-c3',
        originalPosition: 3,
        type: 'picture-puzzle',
        typeDisplay: 'PICTURE PUZZLE',
        question: 'Name this input device that you slide on a desk to move the pointer. (5 letters)',
        correctAnswer: 'MOUSE',
        requiredLetter: 'M',
        acceptedAnswers: ['MOUSE'],
        visualAssetKey: 'mouse',
        hint: 'Handheld pointing device invented by Douglas Engelbart.'
      },
      {
        clueId: 'b1-06-c4',
        originalPosition: 4,
        type: 'match-it',
        typeDisplay: 'MATCH IT',
        question: 'Match the descriptions (A–C) with the devices (1–3):\nA. Puts documents on paper ↔ 1. SCANNER\nB. Shows what the computer is doing ↔ 2. MONITOR\nC. Turns paper pages into digital copies ↔ 3. PRINTER\nMatch each description with its device. Which device matches A?',
        correctAnswer: 'PRINTER',
        requiredLetter: 'P',
        acceptedAnswers: ['PRINTER'],
        hint: 'Produces hard copies on paper.'
      },
      {
        clueId: 'b1-06-c5',
        originalPosition: 5,
        type: 'word-puzzle',
        typeDisplay: 'WORD PUZZLE',
        question: 'Getting files from the internet onto your device is DOWNLOAD. Sending files from your device to the internet is ______.',
        correctAnswer: 'UPLOAD',
        requiredLetter: 'U',
        acceptedAnswers: ['UPLOAD'],
        hint: 'Opposite of download.'
      },
      {
        clueId: 'b1-06-c6',
        originalPosition: 6,
        type: 'tech-question',
        typeDisplay: 'TECH QUESTION',
        question: 'What is the flat rectangular area below a laptop keyboard that you slide your finger on?',
        correctAnswer: 'TOUCHPAD',
        requiredLetter: 'T',
        acceptedAnswers: ['TOUCHPAD', 'TRACKPAD'],
        hint: 'Built-in pointing surface on laptops.'
      },
      {
        clueId: 'b1-06-c7',
        originalPosition: 7,
        type: 'missing-letter',
        typeDisplay: 'MISSING LETTER',
        question: 'Find the missing letter and name the complete word: I N S T ? L L\nWhich letter is missing? Hint: setting up a new program on your computer.',
        missingLetterPattern: 'I N S T ? L L',
        correctAnswer: 'INSTALL',
        requiredLetter: 'I',
        acceptedAnswers: ['INSTALL'],
        hint: 'Missing letter is A.'
      },
      {
        clueId: 'b1-06-c8',
        originalPosition: 8,
        type: 'rebus-puzzle',
        typeDisplay: 'REBUS PUZZLE',
        question: 'Join the two pictures to form another word for a laptop. (8 letters)',
        correctAnswer: 'NOTEBOOK',
        requiredLetter: 'N',
        acceptedAnswers: ['NOTEBOOK'],
        visualAssetKey: 'notebook',
        hint: 'NOTE + BOOK'
      },
      {
        clueId: 'b1-06-c9',
        originalPosition: 9,
        type: 'tech-question',
        typeDisplay: 'TECH QUESTION',
        question: 'Which search engine is so well known that its name has become a verb meaning “to look something up”?',
        correctAnswer: 'GOOGLE',
        requiredLetter: 'G',
        acceptedAnswers: ['GOOGLE'],
        hint: 'Founded by Larry Page and Sergey Brin.'
      }
    ]
  },
  {
    puzzleId: 'puzzle-b1-07',
    targetWord: 'PROTOCOL',
    targetLength: 8,
    sourceBooklet: 'Booklet 1',
    sourceRound: 7,
    clues: [
      {
        clueId: 'b1-07-c1',
        originalPosition: 1,
        type: 'scrambled-word',
        typeDisplay: 'SCRAMBLED WORD',
        question: 'Rearrange these letters to form a technical word: X E L P I',
        scrambledLetters: 'X E L P I',
        correctAnswer: 'PIXEL',
        requiredLetter: 'P',
        acceptedAnswers: ['PIXEL'],
        hint: 'The smallest dot of colour in a digital image.'
      },
      {
        clueId: 'b1-07-c2',
        originalPosition: 2,
        type: 'picture-puzzle',
        typeDisplay: 'PICTURE PUZZLE',
        question: 'Name this desktop icon where deleted files wait before they are permanently removed. (10 letters)',
        correctAnswer: 'RECYCLE BIN',
        requiredLetter: 'R',
        acceptedAnswers: ['RECYCLE BIN', 'RECYCLEBIN', 'TRASH'],
        visualAssetKey: 'recycle-bin',
        hint: 'Windows trash bin for discarded files.'
      },
      {
        clueId: 'b1-07-c3',
        originalPosition: 3,
        type: 'tech-question',
        typeDisplay: 'TECH QUESTION',
        question: 'In programming, symbols like +, −, × and = are called ______.',
        correctAnswer: 'OPERATOR',
        requiredLetter: 'O',
        acceptedAnswers: ['OPERATOR', 'OPERATORS'],
        hint: 'Mathematical or logical symbol that performs an operation.'
      },
      {
        clueId: 'b1-07-c4',
        originalPosition: 4,
        type: 'tech-question',
        typeDisplay: 'TECH QUESTION',
        question: 'Which Windows tool, opened with Ctrl + Shift + Esc, shows running programs and memory use?',
        correctAnswer: 'TASK MANAGER',
        requiredLetter: 'T',
        acceptedAnswers: ['TASK MANAGER', 'TASKMANAGER'],
        hint: 'Shows CPU, memory, disk, and running tasks.'
      },
      {
        clueId: 'b1-07-c5',
        originalPosition: 5,
        type: 'tech-question',
        typeDisplay: 'TECH QUESTION',
        question: 'Which Microsoft email app shares its name with a view of what lies ahead?',
        correctAnswer: 'OUTLOOK',
        requiredLetter: 'O',
        acceptedAnswers: ['OUTLOOK'],
        hint: 'Part of Microsoft Office for email and calendar.'
      },
      {
        clueId: 'b1-07-c6',
        originalPosition: 6,
        type: 'picture-puzzle',
        typeDisplay: 'PICTURE PUZZLE',
        question: 'Name this tiny silicon component that powers processors and memory. (4 letters)',
        correctAnswer: 'CHIP',
        requiredLetter: 'C',
        acceptedAnswers: ['CHIP', 'MICROCHIP'],
        visualAssetKey: 'chip',
        hint: 'Integrated circuit made of silicon.'
      },
      {
        clueId: 'b1-07-c7',
        originalPosition: 7,
        type: 'riddle',
        typeDisplay: 'RIDDLE',
        question: 'When fans fail or dust blocks the airflow, a computer can suffer from me. What am I?',
        correctAnswer: 'OVERHEATING',
        requiredLetter: 'O',
        acceptedAnswers: ['OVERHEATING', 'OVERHEAT'],
        hint: 'Dangerous rise in internal temperature.'
      },
      {
        clueId: 'b1-07-c8',
        originalPosition: 8,
        type: 'picture-puzzle',
        typeDisplay: 'PICTURE PUZZLE',
        question: 'Name this clickable connection on a web page that takes you to another page. (4 letters)',
        correctAnswer: 'LINK',
        requiredLetter: 'L',
        acceptedAnswers: ['LINK', 'HYPERLINK'],
        visualAssetKey: 'link',
        hint: 'Short for hyperlink.'
      }
    ]
  },

  // ==================== BOOKLET 2 ====================
  {
    puzzleId: 'puzzle-b2-01',
    targetWord: 'TOKENIZER',
    targetLength: 9,
    sourceBooklet: 'Booklet 2 (Vol. 2)',
    sourceRound: 1,
    clues: [
      {
        clueId: 'b2-01-c1',
        originalPosition: 1,
        type: 'word-puzzle',
        typeDisplay: 'WORD PUZZLE',
        question: 'In programming, a Boolean value can only be FALSE or ______.',
        correctAnswer: 'TRUE',
        requiredLetter: 'T',
        acceptedAnswers: ['TRUE'],
        hint: 'Binary truth value.'
      },
      {
        clueId: 'b2-01-c2',
        originalPosition: 2,
        type: 'scrambled-word',
        typeDisplay: 'SCRAMBLED WORD',
        question: 'Rearrange these letters to form a technical word: T I O N O P',
        scrambledLetters: 'T I O N O P',
        correctAnswer: 'OPTION',
        requiredLetter: 'O',
        acceptedAnswers: ['OPTION', 'OPTIONS'],
        hint: 'A choice you can pick from a menu or a settings list.'
      },
      {
        clueId: 'b2-01-c3',
        originalPosition: 3,
        type: 'picture-puzzle',
        typeDisplay: 'PICTURE PUZZLE',
        question: 'Name this small metal object that opens a lock. In computing, a secret value locks and unlocks data. (3 letters)',
        correctAnswer: 'KEY',
        requiredLetter: 'K',
        acceptedAnswers: ['KEY'],
        visualAssetKey: 'key',
        hint: 'Used in encryption or dictionary data structures.'
      },
      {
        clueId: 'b2-01-c4',
        originalPosition: 4,
        type: 'tech-question',
        typeDisplay: 'TECH QUESTION',
        question: 'Which wired networking technology connects computers to a local network using LAN cables?',
        correctAnswer: 'ETHERNET',
        requiredLetter: 'E',
        acceptedAnswers: ['ETHERNET'],
        hint: 'Standard cable technology using RJ45 connectors.'
      },
      {
        clueId: 'b2-01-c5',
        originalPosition: 5,
        type: 'riddle',
        typeDisplay: 'RIDDLE',
        question: 'I pop up on your phone screen with a ping to say that something new has arrived. What am I?',
        correctAnswer: 'NOTIFICATION',
        requiredLetter: 'N',
        acceptedAnswers: ['NOTIFICATION', 'NOTIFICATIONS'],
        hint: 'Push alert banner.'
      },
      {
        clueId: 'b2-01-c6',
        originalPosition: 6,
        type: 'missing-letter',
        typeDisplay: 'MISSING LETTER',
        question: 'Find the missing letter and name the complete word: I N T E R ? E T\nWhich letter is missing? Hint: it lets you browse websites from all over the world.',
        missingLetterPattern: 'I N T E R ? E T',
        correctAnswer: 'INTERNET',
        requiredLetter: 'I',
        acceptedAnswers: ['INTERNET'],
        hint: 'Missing letter is N.'
      },
      {
        clueId: 'b2-01-c7',
        originalPosition: 7,
        type: 'picture-puzzle',
        typeDisplay: 'PICTURE PUZZLE',
        question: 'Name this file format that squeezes many files into one smaller compressed folder. (3 letters)',
        correctAnswer: 'ZIP',
        requiredLetter: 'Z',
        acceptedAnswers: ['ZIP'],
        visualAssetKey: 'zip',
        hint: 'Popular archive file format.'
      },
      {
        clueId: 'b2-01-c8',
        originalPosition: 8,
        type: 'tech-question',
        typeDisplay: 'TECH QUESTION',
        question: 'Which Microsoft spreadsheet program is built around rows, columns, cells and formulas?',
        correctAnswer: 'EXCEL',
        requiredLetter: 'E',
        acceptedAnswers: ['EXCEL'],
        hint: 'Spreadsheet tool with XLSX format.'
      },
      {
        clueId: 'b2-01-c9',
        originalPosition: 9,
        type: 'picture-puzzle',
        typeDisplay: 'PICTURE PUZZLE',
        question: 'Name this device that spreads Wi-Fi around your home. (6 letters)',
        correctAnswer: 'ROUTER',
        requiredLetter: 'R',
        acceptedAnswers: ['ROUTER'],
        visualAssetKey: 'router',
        hint: 'Wireless networking router.'
      }
    ]
  },
  {
    puzzleId: 'puzzle-b2-02',
    targetWord: 'CLASSIFIER',
    targetLength: 10,
    sourceBooklet: 'Booklet 2 (Vol. 2)',
    sourceRound: 2,
    clues: [
      {
        clueId: 'b2-02-c1',
        originalPosition: 1,
        type: 'picture-puzzle',
        typeDisplay: 'PICTURE PUZZLE',
        question: 'Name this device that captures photos and videos. (6 letters)',
        correctAnswer: 'CAMERA',
        requiredLetter: 'C',
        acceptedAnswers: ['CAMERA'],
        visualAssetKey: 'camera',
        hint: 'Optical device that records images.'
      },
      {
        clueId: 'b2-02-c2',
        originalPosition: 2,
        type: 'picture-puzzle',
        typeDisplay: 'PICTURE PUZZLE',
        question: 'Name this symbol that appears beside a website address when the connection is secure. (4 letters)',
        correctAnswer: 'LOCK',
        requiredLetter: 'L',
        acceptedAnswers: ['LOCK', 'PADLOCK'],
        visualAssetKey: 'lock',
        hint: 'Represents HTTPS SSL/TLS encryption.'
      },
      {
        clueId: 'b2-02-c3',
        originalPosition: 3,
        type: 'riddle',
        typeDisplay: 'RIDDLE',
        question: 'I store many values of the same kind in a numbered list, and my first position is number 0. What am I?',
        correctAnswer: 'ARRAY',
        requiredLetter: 'A',
        acceptedAnswers: ['ARRAY'],
        hint: 'Zero-indexed linear collection data structure.'
      },
      {
        clueId: 'b2-02-c4',
        originalPosition: 4,
        type: 'riddle',
        typeDisplay: 'RIDDLE',
        question: 'I fit in your pocket, have a touchscreen, run apps and make calls. What am I?',
        correctAnswer: 'SMARTPHONE',
        requiredLetter: 'S',
        acceptedAnswers: ['SMARTPHONE', 'PHONE', 'MOBILE'],
        hint: 'Mobile cellular computer.'
      },
      {
        clueId: 'b2-02-c5',
        originalPosition: 5,
        type: 'tech-question',
        typeDisplay: 'TECH QUESTION',
        question: 'Which networking device connects multiple computers within the same local network?',
        correctAnswer: 'SWITCH',
        requiredLetter: 'S',
        acceptedAnswers: ['SWITCH'],
        hint: 'Network bridge operating at data link layer (Layer 2).'
      },
      {
        clueId: 'b2-02-c6',
        originalPosition: 6,
        type: 'word-puzzle',
        typeDisplay: 'WORD PUZZLE',
        question: 'A keyboard and a microphone are examples of ______ devices.',
        correctAnswer: 'INPUT',
        requiredLetter: 'I',
        acceptedAnswers: ['INPUT'],
        hint: 'Feeds data into a computer.'
      },
      {
        clueId: 'b2-02-c7',
        originalPosition: 7,
        type: 'picture-puzzle',
        typeDisplay: 'PICTURE PUZZLE',
        question: 'Name this container used to organise your files on a computer. (6 letters)',
        correctAnswer: 'FOLDER',
        requiredLetter: 'F',
        acceptedAnswers: ['FOLDER', 'DIRECTORY'],
        visualAssetKey: 'folder',
        hint: 'Directory used in file systems.'
      },
      {
        clueId: 'b2-02-c8',
        originalPosition: 8,
        type: 'scrambled-word',
        typeDisplay: 'SCRAMBLED WORD',
        question: 'Rearrange these letters to form a technical word: M G E A I',
        scrambledLetters: 'M G E A I',
        correctAnswer: 'IMAGE',
        requiredLetter: 'I',
        acceptedAnswers: ['IMAGE'],
        hint: 'A picture file such as a JPG or PNG.'
      },
      {
        clueId: 'b2-02-c9',
        originalPosition: 9,
        type: 'tech-question',
        typeDisplay: 'TECH QUESTION',
        question: 'Which web browser from Microsoft, with a blue-green wave logo, replaced the old Explorer?',
        correctAnswer: 'EDGE',
        requiredLetter: 'E',
        acceptedAnswers: ['EDGE', 'MICROSOFT EDGE'],
        hint: 'Chromium-based browser by Microsoft.'
      },
      {
        clueId: 'b2-02-c10',
        originalPosition: 10,
        type: 'riddle',
        typeDisplay: 'RIDDLE',
        question: 'I am fast, temporary memory. When the power goes off, I forget everything. What am I?',
        correctAnswer: 'RAM',
        requiredLetter: 'R',
        acceptedAnswers: ['RAM', 'RANDOM ACCESS MEMORY'],
        hint: 'Volatile system memory.'
      }
    ]
  },
  {
    puzzleId: 'puzzle-b2-03',
    targetWord: 'COMPILER',
    targetLength: 8,
    sourceBooklet: 'Booklet 2 (Vol. 2)',
    sourceRound: 3,
    clues: [
      {
        clueId: 'b2-03-c1',
        originalPosition: 1,
        type: 'picture-puzzle',
        typeDisplay: 'PICTURE PUZZLE',
        question: 'Name this symbol for storing and accessing files online instead of on your own device. (5 letters)',
        correctAnswer: 'CLOUD',
        requiredLetter: 'C',
        acceptedAnswers: ['CLOUD'],
        visualAssetKey: 'cloud',
        hint: 'Internet remote server storage.'
      },
      {
        clueId: 'b2-03-c2',
        originalPosition: 2,
        type: 'tech-question',
        typeDisplay: 'TECH QUESTION',
        question: 'Windows, Linux and macOS are examples of this main program that manages a computer’s hardware and runs your apps. What is it called?',
        correctAnswer: 'OPERATING SYSTEM',
        requiredLetter: 'O',
        acceptedAnswers: ['OPERATING SYSTEM', 'OS'],
        hint: 'Operating System.'
      },
      {
        clueId: 'b2-03-c3',
        originalPosition: 3,
        type: 'picture-puzzle',
        typeDisplay: 'PICTURE PUZZLE',
        question: 'Name this output device that shows what the computer is doing. (7 letters)',
        correctAnswer: 'MONITOR',
        requiredLetter: 'M',
        acceptedAnswers: ['MONITOR', 'SCREEN'],
        visualAssetKey: 'monitor',
        hint: 'Computer display screen.'
      },
      {
        clueId: 'b2-03-c4',
        originalPosition: 4,
        type: 'riddle',
        typeDisplay: 'RIDDLE',
        question: 'I am a popular beginner-friendly programming language. My name comes from a comedy group, and my logo shows two snakes. What am I?',
        correctAnswer: 'PYTHON',
        requiredLetter: 'P',
        acceptedAnswers: ['PYTHON'],
        hint: 'Named after Monty Python.'
      },
      {
        clueId: 'b2-03-c5',
        originalPosition: 5,
        type: 'riddle',
        typeDisplay: 'RIDDLE',
        question: 'Every email you receive lands in me first. What am I?',
        correctAnswer: 'INBOX',
        requiredLetter: 'I',
        acceptedAnswers: ['INBOX'],
        hint: 'The default mail receptacle.'
      },
      {
        clueId: 'b2-03-c6',
        originalPosition: 6,
        type: 'picture-puzzle',
        typeDisplay: 'PICTURE PUZZLE',
        question: 'Name this portable computer with a built-in screen and keyboard. (6 letters)',
        correctAnswer: 'LAPTOP',
        requiredLetter: 'L',
        acceptedAnswers: ['LAPTOP'],
        visualAssetKey: 'laptop',
        hint: 'Foldable portable computer.'
      },
      {
        clueId: 'b2-03-c7',
        originalPosition: 7,
        type: 'tech-question',
        typeDisplay: 'TECH QUESTION',
        question: 'Which keyboard key confirms a command or starts a new line?',
        correctAnswer: 'ENTER',
        requiredLetter: 'E',
        acceptedAnswers: ['ENTER', 'RETURN'],
        hint: 'Return key.'
      },
      {
        clueId: 'b2-03-c8',
        originalPosition: 8,
        type: 'scrambled-word',
        typeDisplay: 'SCRAMBLED WORD',
        question: 'Rearrange these letters to form a technical word: O T B E O R',
        scrambledLetters: 'O T B E O R',
        correctAnswer: 'REBOOT',
        requiredLetter: 'R',
        acceptedAnswers: ['REBOOT'],
        hint: 'To restart a computer.'
      }
    ]
  },
  {
    puzzleId: 'puzzle-b2-04',
    targetWord: 'INDEXING',
    targetLength: 8,
    sourceBooklet: 'Booklet 2 (Vol. 2)',
    sourceRound: 4,
    clues: [
      {
        clueId: 'b2-04-c1',
        originalPosition: 1,
        type: 'picture-puzzle',
        typeDisplay: 'PICTURE PUZZLE',
        question: 'Name this private-browsing mode that does not save your history. (9 letters)',
        correctAnswer: 'INCOGNITO',
        requiredLetter: 'I',
        acceptedAnswers: ['INCOGNITO'],
        visualAssetKey: 'incognito',
        hint: 'Disguised web browsing.'
      },
      {
        clueId: 'b2-04-c2',
        originalPosition: 2,
        type: 'rebus-puzzle',
        typeDisplay: 'REBUS PUZZLE',
        question: 'Join the two pictures to form a word for computers linked together to share data. (7 letters)',
        correctAnswer: 'NETWORK',
        requiredLetter: 'N',
        acceptedAnswers: ['NETWORK'],
        visualAssetKey: 'network',
        hint: 'NET + WORK'
      },
      {
        clueId: 'b2-04-c3',
        originalPosition: 3,
        type: 'riddle',
        typeDisplay: 'RIDDLE',
        question: 'I store organised information in tables so it can be searched, updated and managed. What am I?',
        correctAnswer: 'DATABASE',
        requiredLetter: 'D',
        acceptedAnswers: ['DATABASE'],
        hint: 'A structured set of data held in a computer.'
      },
      {
        clueId: 'b2-04-c4',
        originalPosition: 4,
        type: 'tech-question',
        typeDisplay: 'TECH QUESTION',
        question: 'What is the process of scrambling data so that only authorised people can read it?',
        correctAnswer: 'ENCRYPTION',
        requiredLetter: 'E',
        acceptedAnswers: ['ENCRYPTION'],
        hint: 'Converting plaintext into ciphertext.'
      },
      {
        clueId: 'b2-04-c5',
        originalPosition: 5,
        type: 'tech-question',
        typeDisplay: 'TECH QUESTION',
        question: 'Which three-letter markup language uses custom tags to store and transport data?',
        correctAnswer: 'XML',
        requiredLetter: 'X',
        acceptedAnswers: ['XML'],
        hint: 'Extensible Markup Language.'
      },
      {
        clueId: 'b2-04-c6',
        originalPosition: 6,
        type: 'tech-question',
        typeDisplay: 'TECH QUESTION',
        question: 'In programming, which two-letter keyword runs a block of code only when a condition is true?',
        correctAnswer: 'IF',
        requiredLetter: 'I',
        acceptedAnswers: ['IF'],
        hint: 'Conditional branching statement.'
      },
      {
        clueId: 'b2-04-c7',
        originalPosition: 7,
        type: 'scrambled-word',
        typeDisplay: 'SCRAMBLED WORD',
        question: 'Rearrange these letters to form a technical word: T E P A D O N',
        scrambledLetters: 'T E P A D O N',
        correctAnswer: 'NOTEPAD',
        requiredLetter: 'N',
        acceptedAnswers: ['NOTEPAD'],
        hint: 'A basic text editor that comes with Windows.'
      },
      {
        clueId: 'b2-04-c8',
        originalPosition: 8,
        type: 'picture-puzzle',
        typeDisplay: 'PICTURE PUZZLE',
        question: 'Name this round model of the Earth, often used as the symbol of the web. (5 letters)',
        correctAnswer: 'GLOBE',
        requiredLetter: 'G',
        acceptedAnswers: ['GLOBE'],
        visualAssetKey: 'globe',
        hint: 'Spherical representation of the earth.'
      }
    ]
  },
  {
    puzzleId: 'puzzle-b2-05',
    targetWord: 'ENGINEER',
    targetLength: 8,
    sourceBooklet: 'Booklet 2 (Vol. 2)',
    sourceRound: 5,
    clues: [
      {
        clueId: 'b2-05-c1',
        originalPosition: 1,
        type: 'picture-puzzle',
        typeDisplay: 'PICTURE PUZZLE',
        question: 'Name this message that is sent using an address containing the @ symbol. (5 letters)',
        correctAnswer: 'EMAIL',
        requiredLetter: 'E',
        acceptedAnswers: ['EMAIL', 'E-MAIL'],
        visualAssetKey: 'email',
        hint: 'Electronic mail.'
      },
      {
        clueId: 'b2-05-c2',
        originalPosition: 2,
        type: 'rebus-puzzle',
        typeDisplay: 'REBUS PUZZLE',
        question: 'Join the two pictures to form a word for a portable computer or a paper pad. (8 letters)',
        correctAnswer: 'NOTEBOOK',
        requiredLetter: 'N',
        acceptedAnswers: ['NOTEBOOK'],
        visualAssetKey: 'notebook',
        hint: 'NOTE + BOOK'
      },
      {
        clueId: 'b2-05-c3',
        originalPosition: 3,
        type: 'tech-question',
        typeDisplay: 'TECH QUESTION',
        question: 'Which search engine is so well known that its name has become a verb meaning “to look something up”?',
        correctAnswer: 'GOOGLE',
        requiredLetter: 'G',
        acceptedAnswers: ['GOOGLE'],
        hint: 'The most popular web search engine.'
      },
      {
        clueId: 'b2-05-c4',
        originalPosition: 4,
        type: 'tech-question',
        typeDisplay: 'TECH QUESTION',
        question: 'What are the small clickable pictures on your desktop or phone screen called?',
        correctAnswer: 'ICON',
        requiredLetter: 'I',
        acceptedAnswers: ['ICON', 'ICONS'],
        hint: 'Small visual icon representation.'
      },
      {
        clueId: 'b2-05-c5',
        originalPosition: 5,
        type: 'logic-puzzle',
        typeDisplay: 'LOGIC PUZZLE',
        question: 'Basic logic gates: AND , OR , ? Complete the three basic logic gates: AND, OR, ______.',
        correctAnswer: 'NOT',
        requiredLetter: 'N',
        acceptedAnswers: ['NOT'],
        hint: 'Inverting gate.'
      },
      {
        clueId: 'b2-05-c6',
        originalPosition: 6,
        type: 'riddle',
        typeDisplay: 'RIDDLE',
        question: '“404 Not Found” is an example of me. I appear when a request fails or something goes wrong. What am I?',
        correctAnswer: 'ERROR',
        requiredLetter: 'E',
        acceptedAnswers: ['ERROR'],
        hint: 'HTTP failure indicator.'
      },
      {
        clueId: 'b2-05-c7',
        originalPosition: 7,
        type: 'tech-question',
        typeDisplay: 'TECH QUESTION',
        question: 'The letters at the end of a file name, such as .txt, .jpg or .pdf, are called the file ______.',
        correctAnswer: 'EXTENSION',
        requiredLetter: 'E',
        acceptedAnswers: ['EXTENSION', 'FILE EXTENSION'],
        hint: 'Indicates file type and encoding.'
      },
      {
        clueId: 'b2-05-c8',
        originalPosition: 8,
        type: 'picture-puzzle',
        typeDisplay: 'PICTURE PUZZLE',
        question: 'Name this desktop icon where deleted files wait before they are permanently removed. (10 letters)',
        correctAnswer: 'RECYCLE BIN',
        requiredLetter: 'R',
        acceptedAnswers: ['RECYCLE BIN', 'RECYCLEBIN', 'TRASH'],
        visualAssetKey: 'recycle-bin',
        hint: 'Trash can icon.'
      }
    ]
  },
  {
    puzzleId: 'puzzle-b2-06',
    targetWord: 'ALGORITHM',
    targetLength: 9,
    sourceBooklet: 'Booklet 2 (Vol. 2)',
    sourceRound: 6,
    clues: [
      {
        clueId: 'b2-06-c1',
        originalPosition: 1,
        type: 'tech-question',
        typeDisplay: 'TECH QUESTION',
        question: 'Which two-letter abbreviation stands for machines that can learn and make decisions like humans?',
        correctAnswer: 'AI',
        requiredLetter: 'A',
        acceptedAnswers: ['AI', 'ARTIFICIAL INTELLIGENCE'],
        hint: 'Artificial Intelligence.'
      },
      {
        clueId: 'b2-06-c2',
        originalPosition: 2,
        type: 'picture-puzzle',
        typeDisplay: 'PICTURE PUZZLE',
        question: 'Name this clickable connection on a web page that takes you to another page. (4 letters)',
        correctAnswer: 'LINK',
        requiredLetter: 'L',
        acceptedAnswers: ['LINK', 'HYPERLINK'],
        visualAssetKey: 'link',
        hint: 'Clickable connection.'
      },
      {
        clueId: 'b2-06-c3',
        originalPosition: 3,
        type: 'tech-question',
        typeDisplay: 'TECH QUESTION',
        question: 'Which data-storage unit is bigger than a megabyte but smaller than a terabyte?',
        correctAnswer: 'GIGABYTE',
        requiredLetter: 'G',
        acceptedAnswers: ['GIGABYTE', 'GB'],
        hint: '1,024 Megabytes.'
      },
      {
        clueId: 'b2-06-c4',
        originalPosition: 4,
        type: 'word-puzzle',
        typeDisplay: 'WORD PUZZLE',
        question: 'The opposite of being online is being ______.',
        correctAnswer: 'OFFLINE',
        requiredLetter: 'O',
        acceptedAnswers: ['OFFLINE'],
        hint: 'Disconnected from the network.'
      },
      {
        clueId: 'b2-06-c5',
        originalPosition: 5,
        type: 'riddle',
        typeDisplay: 'RIDDLE',
        question: 'My contents are “Read-Only”. I permanently store the startup instructions of a computer. What is my three-letter name?',
        correctAnswer: 'ROM',
        requiredLetter: 'R',
        acceptedAnswers: ['ROM', 'READ ONLY MEMORY'],
        hint: 'Read Only Memory.'
      },
      {
        clueId: 'b2-06-c6',
        originalPosition: 6,
        type: 'missing-letter',
        typeDisplay: 'MISSING LETTER',
        question: 'Find the missing letter and name the complete word: I N S T ? L L\nWhich letter is missing? Hint: setting up a new program on your computer.',
        missingLetterPattern: 'I N S T ? L L',
        correctAnswer: 'INSTALL',
        requiredLetter: 'I',
        acceptedAnswers: ['INSTALL'],
        hint: 'Missing letter is A.'
      },
      {
        clueId: 'b2-06-c7',
        originalPosition: 7,
        type: 'picture-puzzle',
        typeDisplay: 'PICTURE PUZZLE',
        question: 'Name this flat touchscreen device that is bigger than a phone. (6 letters)',
        correctAnswer: 'TABLET',
        requiredLetter: 'T',
        acceptedAnswers: ['TABLET'],
        visualAssetKey: 'tablet',
        hint: 'Touchscreen slate device.'
      },
      {
        clueId: 'b2-06-c8',
        originalPosition: 8,
        type: 'tech-question',
        typeDisplay: 'TECH QUESTION',
        question: 'Which four-letter language gives every web page its structure, with headings, paragraphs and images?',
        correctAnswer: 'HTML',
        requiredLetter: 'H',
        acceptedAnswers: ['HTML'],
        hint: 'HyperText Markup Language.'
      },
      {
        clueId: 'b2-06-c9',
        originalPosition: 9,
        type: 'picture-puzzle',
        typeDisplay: 'PICTURE PUZZLE',
        question: 'Name this small device you slide on a desk to move the pointer. (5 letters)',
        correctAnswer: 'MOUSE',
        requiredLetter: 'M',
        acceptedAnswers: ['MOUSE'],
        visualAssetKey: 'mouse',
        hint: 'Desktop input mouse.'
      }
    ]
  }
];
