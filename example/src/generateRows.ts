import { isTimeToYield, yieldControl } from "main-thread-scheduling";
import { Grid } from "../../src/grid";
import { Cell, Row } from "../../src/row";
import { Rows } from "../../src/row-manager/row-manager";

const N_COLS = 15;
const MIN_BATCH_SIZE = 1_000;
const MAX_BATCH_SIZE = 20_000;
const TARGET_YIELD_MS = 8;

const skewedRandom = () => {
  const a = Math.pow(Math.random(), 2);
  if (Math.random() < 0.5) {
    return a;
  }
  return 1 - a;
};

export const generateRows = async (
  rowCount: number,
  grid: Grid,
  cb: () => void
) => {
  const rows: Rows = [];
  let cellIndex = 0;
  let batchSize = Math.min(
    MAX_BATCH_SIZE,
    Math.max(MIN_BATCH_SIZE, Math.floor(rowCount / 50) || MIN_BATCH_SIZE)
  );
  let rowsSinceYield = 0;
  let lastYieldTs = performance.now();

  const maybeYield = async (force = false) => {
    if (
      !force &&
      rowsSinceYield < batchSize &&
      !isTimeToYield("background")
    ) {
      return true;
    }

    grid.rowManager.setRows(rows, true);
    rowsSinceYield = 0;

    await yieldControl("background");

    if (!grid.container.isConnected) {
      return false;
    }

    const now = performance.now();
    const elapsed = now - lastYieldTs;
    lastYieldTs = now;

    if (elapsed > TARGET_YIELD_MS && batchSize > MIN_BATCH_SIZE) {
      batchSize = Math.max(MIN_BATCH_SIZE, Math.floor(batchSize * 0.75));
    } else if (elapsed < TARGET_YIELD_MS / 2 && batchSize < MAX_BATCH_SIZE) {
      batchSize = Math.min(MAX_BATCH_SIZE, Math.floor(batchSize * 1.2));
    }

    return true;
  };

  for (let rowIdx = 0; rowIdx < rowCount; rowIdx++) {
    const cells: Cell[] = [{ id: -rowIdx - 1, v: String(rowIdx + 1) }];

    const firstName = FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)];
    const lastName = LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)];
    const age = Math.floor(Math.random() * (99 - 18 + 1)) + 18;

    for (let cellIdx = 0; cellIdx < N_COLS; cellIdx++) {
      let value: string | number;

      switch (cellIdx) {
        case 0:
          value = firstName;
          break;
        case 1:
          value = lastName;
          break;
        case 2:
          value = age;
          break;
        default:
          value = Math.round(skewedRandom() * (Math.random() * 1_000_000));
      }

      cells.push({ id: cellIndex++, v: value });
    }

    rows.push({ id: rowIdx, cells } satisfies Row);
    rowsSinceYield += 1;

    const keepGoing = await maybeYield(rowsSinceYield >= batchSize);
    if (!keepGoing) {
      return;
    }
  }

  await maybeYield(true);
  if (!grid.container.isConnected) {
    return;
  }

  grid.rowManager.setRows(rows);
  cb();
};


export const COLUMNS = [
  "Index",
  "First Name",
  "Last Name",
  "Age",
  "Column 5",
  "Column 6",
  "Column 7",
  "Column 8",
  "Column 9",
  "Column 10",
  "Column 11",
  "Column 12",
  "Column 13",
  "Column 14",
  "Column 15",
  "Column 16",
];

const FIRST_NAMES: string[] = [
  "James",
  "Mary",
  "John",
  "Patricia",
  "Robert",
  "Jennifer",
  "Michael",
  "Linda",
  "William",
  "Elizabeth",
  "David",
  "Barbara",
  "Richard",
  "Susan",
  "Joseph",
  "Jessica",
  "Thomas",
  "Sarah",
  "Charles",
  "Karen",
  "Christopher",
  "Nancy",
  "Daniel",
  "Lisa",
  "Matthew",
  "Betty",
  "Anthony",
  "Margaret",
  "Mark",
  "Sandra",
  "Donald",
  "Ashley",
  "Steven",
  "Kimberly",
  "Paul",
  "Emily",
  "Andrew",
  "Donna",
  "Joshua",
  "Michelle",
  "Kenneth",
  "Dorothy",
  "Kevin",
  "Carol",
  "Brian",
  "Amanda",
  "George",
  "Melissa",
  "Edward",
  "Deborah",
  "Jason",
  "Stephanie",
  "Jeffrey",
  "Rebecca",
  "Ryan",
  "Sharon",
  "Jacob",
  "Cynthia",
  "Gary",
  "Kathleen",
  "Nicholas",
  "Shirley",
  "Eric",
  "Amy",
  "Jonathan",
  "Angela",
  "Stephen",
  "Helen",
  "Larry",
  "Anna",
  "Justin",
  "Brenda",
  "Scott",
  "Pamela",
  "Brandon",
  "Nicole",
  "Frank",
  "Samantha",
  "Gregory",
  "Katherine",
  "Raymond",
  "Christine",
  "Benjamin",
  "Debra",
  "Samuel",
  "Rachel",
  "Patrick",
  "Catherine",
  "Alexander",
  "Carolyn",
  "Jack",
  "Janet",
  "Dennis",
  "Ruth",
  "Jerry",
  "Maria",
  "Tyler",
  "Heather",
  "Aaron",
  "Diane",
  "Ethan",
  "Megan",
  "Austin",
  "Lauren",
  "Zachary",
  "Victoria",
  "Adam",
  "Olivia",
  "Nathan",
  "Sophia",
  "Jose",
  "Isabella",
  "Charles",
  "Mia",
  "Thomas",
  "Emily",
  "Jordan",
  "Madison",
  "Cameron",
  "Avery",
  "Hunter",
  "Ella",
  "Christian",
  "Scarlett",
  "Aidan",
  "Grace",
  "Evan",
  "Chloe",
  "Isaac",
  "Lily",
  "Luke",
  "Hannah",
  "Mason",
  "Aria",
  "Jayden",
  "Zoe",
  "Gabriel",
  "Layla",
  "Caleb",
  "Riley",
  "Dylan",
  "Nora",
  "Henry",
  "Lillian",
  "Owen",
  "Addison",
  "Wyatt",
  "Aubrey",
  "Jack",
  "Eleanor",
  "Sebastian",
  "Stella",
  "Julian",
  "Natalie",
  "Levi",
  "Hazel",
  "Isaiah",
  "Violet",
  "Landon",
  "Aurora",
  "David",
  "Savannah",
  "Andrew",
  "Penelope",
  "Jaxon",
  "Brooklyn",
  "Eli",
  "Paisley",
  "Aaron",
  "Claire",
  "Christopher",
  "Skylar",
  "Joshua",
  "Lucy",
  "Nolan",
  "Anna",
  "Adrian",
  "Samantha",
  "Carter",
  "Kennedy",
  "Asher",
  "Sadie",
  "Leo",
  "Allison",
  "Jeremiah",
  "Gabriella",
  "Hudson",
  "Ariana",
  "Lincoln",
  "Alice",
  "Grayson",
  "Madeline",
  "Jace",
  "Ruby",
  "Mateo",
  "Eva",
  "Jason",
  "Autumn",
  "Ezra",
  "Quinn",
  "Parker",
  "Piper",
  "Josiah",
  "Sophie",
  "Carson",
  "Lydia",
];

const LAST_NAMES: string[] = [
  "Smith",
  "Johnson",
  "Williams",
  "Brown",
  "Jones",
  "Miller",
  "Davis",
  "Wilson",
  "Anderson",
  "Thomas",
  "Taylor",
  "Moore",
  "Jackson",
  "Martin",
  "White",
  "Clark",
  "Lewis",
  "Robinson",
  "Walker",
  "Young",
  "Allen",
  "King",
  "Wright",
  "Scott",
  "Hill",
  "Green",
  "Adams",
  "Nelson",
  "Baker",
  "Hall",
  "Campbell",
  "Mitchell",
  "Carter",
  "Roberts",
  "Phillips",
  "Evans",
  "Turner",
  "Parker",
  "Edwards",
  "Collins",
  "Stewart",
  "Morris",
  "Murphy",
  "Cook",
  "Rogers",
  "Morgan",
  "Cooper",
  "Peterson",
  "Bailey",
  "Reed",
  "Kelly",
  "Howard",
  "Cox",
  "Ward",
  "Richardson",
  "Watson",
  "Brooks",
  "Wood",
  "James",
  "Bennett",
  "Gray",
  "Hughes",
  "Price",
  "Sanders",
  "Myers",
  "Long",
  "Ross",
  "Foster",
  "Harrison",
  "Graham",
  "Fisher",
  "Hansen",
  "Grant",
  "Hart",
  "Spencer",
  "Gardner",
  "Payne",
  "Pierce",
  "Berry",
  "Matthews",
  "Arnold",
  "Wagner",
  "Willis",
  "Ray",
  "Watkins",
  "Olson",
  "Carroll",
  "Duncan",
  "Snyder",
  "Hart",
  "Cunningham",
  "Bradley",
  "Lane",
  "Andrews",
  "Ruiz",
  "Harper",
  "Fox",
  "Riley",
  "Armstrong",
  "Carpenter",
  "Weaver",
  "Greene",
  "Lawrence",
  "Elliott",
  "Chavez",
  "Sims",
  "Austin",
  "Peters",
  "Kelley",
  "Franklin",
  "Lawson",
  "Fields",
  "Gutierrez",
  "Ryan",
  "Schmidt",
  "Carr",
  "Vasquez",
  "Castillo",
  "Wheeler",
  "Chapman",
  "Oliver",
  "Montgomery",
  "Richards",
  "Williamson",
  "Johnston",
  "Banks",
  "Meyer",
  "Bishop",
  "McCoy",
  "Howell",
  "Alvarez",
  "Morrison",
  "Hansen",
  "Fernandez",
  "Garza",
  "Harvey",
  "Little",
  "Burton",
  "Stanley",
  "Nguyen",
  "George",
  "Jacobs",
  "Reid",
  "Kim",
  "Fuller",
  "Lynch",
  "Dean",
  "Gilbert",
  "Garrett",
  "Romero",
  "Welch",
  "Larson",
  "Frazier",
  "Burke",
  "Hanson",
  "Day",
  "Mendoza",
  "Moreno",
  "Bowman",
  "Medina",
  "Fowler",
  "Brewer",
  "Hoffman",
  "Carlson",
  "Silva",
  "Pearson",
  "Holland",
  "Douglas",
  "Fleming",
  "Jensen",
  "Vargas",
  "Byrd",
  "Davidson",
];
