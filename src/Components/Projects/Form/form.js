import { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import styles from './form.module.css';
import Form from '../../Shared/Form/index';
import Button from '../../Shared/Button';
import { Input, Select } from '../../Shared/Input/index';

const ProjectsForm = () => {
  let history = useHistory();
  const projectId = history.location.state?.id;
  const [employees, setEmployees] = useState([]);
  const [employee, setEmployee] = useState({
    id: '',
    role: '',
    rate: ''
  });
  const [project, setProject] = useState({
    name: '',
    description: '',
    startDate: '',
    endDate: '',
    clientName: '',
    active: '',
    employees: []
  });
  const roles = ['DEV', 'TL', 'QA', 'PM'];
  const statusProject = ['Active', 'Inactive'];

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/employees`)
      .then((res) => res.json())
      .then((res) => setEmployees(res.data));
  }, []);

  useEffect(() => {
    if (projectId) {
      fetch(`${process.env.REACT_APP_API_URL}/projects/${projectId}`)
        .then((res) => res.json())
        .then((res) => {
          setProject({
            name: res.data.name,
            description: res.data.description,
            startDate: res.data.startDate.slice(0, 10),
            endDate: res.data.endDate.slice(0, 10),
            clientName: res.data.clientName,
            active: res.data.active,
            employees: res.data.employees
              .filter((e) => e.id && typeof e.id == 'object')
              .map((e) => ({ id: e.id._id, role: e.role, rate: e.rate }))
          });
        });
    }
  }, []);

  const format = (d) => {
    const today = new Date(d);
    const dd = today.getDate();
    const mm = today.getMonth() + 1;
    const yyyy = today.getFullYear();
    return mm + '/' + dd + '/' + yyyy;
  };

  const updateProject = (e) => {
    e.preventDefault();
    project.startDate = format(project.startDate);
    project.endDate = format(project.endDate);
    if (projectId) {
      fetch(`${process.env.REACT_APP_API_URL}/projects/${projectId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(project)
      }).then(() => {
        alert(`Project ${project.name} updated successfully!`);
        history.push('/projects');
      });
    } else {
      fetch(`${process.env.REACT_APP_API_URL}/projects`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(project)
      })
        .then((res) => res.json())
        .then((json) => {
          if (json.error) {
            alert(json.message);
          } else {
            history.push('/projects');
          }
        });
    }
  };

  const onChange = (e) => {
    setProject({ ...project, [e.target.name]: e.target.value });
  };

  const onChangeEmployee = (e) => {
    setEmployee({ ...employee, [e.target.name]: e.target.value });
  };

  const handleChangeEmployee = (e) => {
    setEmployee({ ...employee, id: e.target.value });
  };

  const assignEmployee = () => {
    const newProject = { ...project };
    newProject.employees.push(employee);
    setProject(newProject);
  };

  const getName = (id) => {
    let employee = employees.find(function (e) {
      return e._id === id;
    });
    return employee?.name + ' ' + employee?.lastName;
  };
  console.log(employee);
  return (
    <section className={styles.container}>
      <Form onSubmit={updateProject} secondColumnIndex={5}>
        <Input
          title="ProjectName"
          id="ProjectName"
          value={project.name}
          name="name"
          onChange={onChange}
          required
        />
        <Input
          title="Client"
          id="client"
          value={project.clientName}
          name="clientName"
          onChange={onChange}
          required
        />
        <Input
          title="Description"
          id="description"
          value={project.description}
          name="description"
          onChange={onChange}
          required
        />
        <Input
          title="Start Date"
          value={project.startDate}
          name="startDate"
          type="date"
          onChange={onChange}
          required
        />
        <Input
          title="End Date"
          value={project.endDate}
          name="endDate"
          type="date"
          onChange={onChange}
          required
        />
        <Select
          title="Active"
          name="active"
          value={project.active}
          arrayToMap={statusProject.map((status) => ({
            id: status === 'Active',
            label: status
          }))}
          placeholder="Status"
          id="active"
          onChange={onChange}
          required
        />
        <div className={styles.divContainer}>
          <div className={styles.employeesContainer}>
            <h3>Employees:</h3>
            {project?.employees?.map((e, i) => (
              <div key={i}>
                <span>{'Name: ' + getName(e.id) + ' '}</span>
                <span>{'Role: ' + e.role + ' '}</span>
                <span>{'Rate: ' + e.rate + ' '}</span>
              </div>
            ))}
          </div>
          <Select
            name="name"
            placeholder="Name"
            arrayToMap={employees.map((employee) => ({
              id: employee._id,
              label: employee.name + ' ' + employee.lastName
            }))}
            onChange={handleChangeEmployee}
            required
          />
          <Select
            name="role"
            placeholder="Role"
            arrayToMap={roles.map((rol) => ({
              id: rol,
              label: rol
            }))}
            onChange={onChangeEmployee}
            required
          />
          <Input
            name="rate"
            placeholder="Rate"
            type="number"
            onChange={onChangeEmployee}
            required
          />
          <Button className={styles.btnAssign} label="Assign" onClick={assignEmployee} />
        </div>
      </Form>
    </section>
  );
};

export default ProjectsForm;
