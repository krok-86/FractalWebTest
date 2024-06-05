import { FC, useState } from 'react';
import './App.css';
import Select from 'react-select';

const USER_URL = 'https://api.github.com/users/';
const REPO_URL = 'https://api.github.com/repos/';
const SELECT_ARRAY = [
  { value: 'user', label: 'user' },
  { value: 'repo', label: 'repo' },
]

const App = () => {
  const [result, setResult] = useState('');

  const handleSubmit = (current: string) => {
    setResult(current);
  }

  return (
    <div className="App">
      <Form handleSubmit={handleSubmit} />
      <div>{result}</div>
    </div>
  );
}

type FormType = {
  handleSubmit: (current: string) => void;
}
const Form: FC<FormType> = ({ handleSubmit }) => {
  const [value, setValue] = useState<string | undefined>(undefined);
  const [option, setOption] = useState<OptionType | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);

  const handleChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e?.currentTarget?.value);
  };

  const addResult = async (e:  React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!option) return;
    let textUser: string;
    let res: Response;

    try {
      setIsLoading(true)
      if (option?.value === "user") {
        res = await fetch(USER_URL + value)
        const resParsedUser = await res.json();
        textUser = `Full name: ${resParsedUser?.name}, number of repos: ${resParsedUser?.public_repos || 0}`
        if(!resParsedUser?.name) {
          textUser = 'Данные об этом юзере не найдены';
        }
      } else {
        res = await fetch(REPO_URL + value)
        const resParsedRepo = await res.json();
        textUser = `Repository name: ${resParsedRepo?.name}, number of stars: ${resParsedRepo?.stargazers_count || 0}`;
        if(!resParsedRepo?.name) {
          textUser = 'Данные об этом репозитории не найдены';
        }
      }
      handleSubmit(textUser);
    } catch (err) {
      console.error('Ошибка при выполнении запроса:', err);
      textUser = 'Произошла ошибка при выполнении запроса. Пожалуйста, попробуйте еще раз или обратитесь к администратору.';
    }
    finally {
      setIsLoading(false);
    }
  };
    const handleSelectOption = (selectedOption: OptionType) => {
    setOption(selectedOption);
  };

  return (
    <form>
      <Selector option={option} handleSelectOption={handleSelectOption} />
      <input
        className='input-data'
        name=''
        value={value || ''}
        onChange={handleChangeInput}
      />
      <button
        onClick={addResult}
        disabled={isLoading || !value?.length || !option}
      >
        Submit
      </button>
    </form>
  )
}
type OptionType = {
  label: string;
  value: string;
}
type SelectorType = {
  option?: OptionType;
  handleSelectOption: (option: OptionType) => void;
}
const Selector: FC<SelectorType> = ({ option, handleSelectOption }) => {

    const handleSelect = (selectedValue: OptionType | null) => {
    if (selectedValue) {
      handleSelectOption(selectedValue);
    }
  };

  return (
    <Select
      isClearable={false}
      options={SELECT_ARRAY}
      onChange={(value) => handleSelect(value)}
      placeholder="Select..."
      value={option}
      required={true}
      classNamePrefix="custom-select"
    />
  )
}

export default App;
