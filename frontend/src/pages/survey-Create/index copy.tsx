import React, { useState } from 'react';
import { Button, message, Steps, Divider, Modal } from 'antd';
import { PageOne } from './pageOne';
import { PageTwo } from './pageTwo';

const { Step } = Steps;

const styleForm = { marginLeft: '10em', marginRight: '10em', marginTop: '3em' };

const steps = [
  {
    title: 'Page 1',
  },
  {
    title: 'Page 2',
  },
  {
    title: 'Preview',
  },
];

//Page2

export const SurveyCreate: React.FC<any> = () => {
  const [current, setCurrent] = React.useState(0);

  const next = () => {
    setCurrent(current + 1);
  };

  const prev = () => {
    setCurrent(current - 1);
  };

  interface type {
    s_company_name:string
  }

  const [state, setState] = React.useState({
    value1: "test",
    s_company_name: "",
    s_title: "",
    s_issue_date: "",
    s_details: "",
    s_images: "",
    s_remark: "",
    s_startdate: "",
    s_number_users: "",
    s_note: "",
  }); 

  return (
    <>
      <Steps current={current}>
        {steps.map((item) => (
          <Step key={item.title} title={item.title} />
        ))}
      </Steps>
      <div className="steps-content">
        {current + 1 === 1 && (
          <div id="stepForm1" style={styleForm}>
            <PageOne 
            s_comp= {state.s_company_name}
            s_titl={state.s_title}
            s_issu={state.s_issue_date}
            s_deta={state.s_details}
            s_imag={state.s_images}
            s_rema={state.s_remark}
            s_star={state.s_startdate}
            s_numb={state.s_number_users}
            s_note={state.s_note}
            SetState={setState}/>
          </div>
        )}
        {current + 1 === 2 && (
          <div id="stepForm2" style={styleForm}>
            <PageTwo />
          </div>
        )}
        {current + 1 === 3 && <div id="stepForm3">3</div>}
      </div>

      <Divider />

      <div className="steps-action" style={{ textAlign: 'center' }}>
        {current < steps.length - 1 && (
          <Button type="primary" onClick={() => next()}>
            Next
          </Button>
        )}
        {current === steps.length - 1 && (
          <Button type="primary" onClick={() => message.success('Processing complete!')}>
            Done
          </Button>
        )}
        {current > 0 && (
          <Button style={{ margin: '0 8px' }} onClick={() => prev()}>
            Previous
          </Button>
        )}
      </div>
    </>
  );
};
