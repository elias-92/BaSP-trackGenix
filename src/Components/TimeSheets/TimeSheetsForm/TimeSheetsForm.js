import React, { useState, useEffect } from 'react';
import styles from './timeSheetsForm.module.css';
import { useHistory } from 'react-router-dom';
import Form from '../../Shared/Form';
import { Input, Select } from '../../Shared/Input';

const TimeSheetsForm = () => {
  const history = useHistory();
  const editId = history.location.state?.id;
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [selectedProject, setSelectedProject] = useState();
  const [selectedTask, setSelectedTask] = useState();
  const [selectedEmployee, setSelectedEmployee] = useState();
  const [titleForm, setTitleForm] = useState('Add new Timesheet');
  const [timeSheetInput, setTimeSheetInput] = useState({
    project: '',
    task: '',
    employee: '',
    description: '',
    date: '',
    hours: ''
  });

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/tasks`)
      .then((res) => res.json())
      .then((json) => {
        setTasks(json.data);
      });
    fetch(`${process.env.REACT_APP_API_URL}/projects`)
      .then((res) => res.json())
      .then((json) => {
        setProjects(json.data);
      });
    fetch(`${process.env.REACT_APP_API_URL}/employees`)
      .then((res) => res.json())
      .then((json) => {
        setEmployees(json.data);
      });
    if (editId) {
      fetch(`${process.env.REACT_APP_API_URL}/timesheets/${editId}`)
        .then((res) => res.json())
        .then((json) => {
          setTimeSheetInput({
            project: json.data.project?._id,
            task: json.data.task?._id,
            employee: json.data.employee?._id,
            description: json.data.description,
            date: json.data.date.slice(0, 10),
            hours: json.data.hours
          });
          setSelectedProject(json.data.project?._id);
          setSelectedEmployee(json.data.employee?._id);
          setSelectedTask(json.data.task?._id);
        });
      setTitleForm('Edit');
    }
  }, []);

  const onChange = (e) => {
    setTimeSheetInput({ ...timeSheetInput, [e.target.name]: e.target.value });
  };

  const handleChangeProject = (e) => {
    setSelectedProject(e.target.value);
    setTimeSheetInput({ ...timeSheetInput, [e.target.name]: e.target.value });
  };

  const handleChangeTask = (e) => {
    setSelectedTask(e.target.value);
    setTimeSheetInput({ ...timeSheetInput, [e.target.name]: e.target.value });
  };

  const handleChangeEmployee = (e) => {
    setSelectedEmployee(e.target.value);
    setTimeSheetInput({ ...timeSheetInput, [e.target.name]: e.target.value });
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (selectedProject && selectedTask && selectedEmployee) {
      if (editId) {
        editItem(timeSheetInput);
      } else {
        addItem(timeSheetInput);
      }
    } else {
      alert('All fields are required');
    }
  };

  const addItem = ({ project, task, employee, description, date, hours }) => {
    const newItem = {
      project,
      task,
      employee,
      description,
      date,
      hours: +hours
    };

    fetch(`${process.env.REACT_APP_API_URL}/timeSheets`, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newItem)
    }).then(() => {
      history.push('/time-sheets');
    });
  };

  const editItem = ({ project, task, employee, description, date, hours }) => {
    const editItem = {
      project,
      task,
      employee,
      description,
      date,
      hours: +hours
    };

    fetch(`${process.env.REACT_APP_API_URL}/timeSheets/${editId}`, {
      method: 'put',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(editItem)
    }).then(() => {
      history.push('/time-sheets');
    });
  };

  const project = () => projects.map((project) => project._id);
  const task = () => tasks.map((task) => task._id);
  const employee = () => employees.map((employee) => employee._id);

  return (
    <section className={styles.container}>
      <Form onSubmit={onSubmit} title={titleForm}>
        <Select
          placeholder="test"
          onChange={handleChangeProject}
          value={selectedProject}
          name="project"
          arrayToMap={project()}
          title={'Project'}
          required
        />
        <Select
          onChange={handleChangeTask}
          value={selectedTask}
          name="task"
          arrayToMap={task()}
          title={'Project'}
          required
        />
        <Select
          onChange={handleChangeEmployee}
          value={selectedEmployee}
          name="employee"
          arrayToMap={employee()}
          title={'Employee'}
          required
        />
        <Input
          onChange={onChange}
          value={timeSheetInput.description}
          name="description"
          title={'Description'}
          required
        />
        <Input
          onChange={onChange}
          value={timeSheetInput.date}
          name="date"
          type="date"
          title={'Date'}
          required
        />
        <Input
          onChange={onChange}
          value={timeSheetInput.hours}
          name="hours"
          type="number"
          title={'Hours'}
          required
        />
      </Form>
    </section>
  );
};
export default TimeSheetsForm;
