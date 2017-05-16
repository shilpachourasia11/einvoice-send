import React from 'react';
import { Button } from 'react-bootstrap';

export default class ServiceConfigFlow4 extends React.Component {

    static propTypes = {
        onNext : React.PropTypes.func.isRequired,
        onPrevious : React.PropTypes.func.isRequired
    };

    render()
    {
        return (
            <div>
                <h3>Level of Participation</h3>

                <div className="bs-callout bs-callout-info">
                    <h4>Please choose your preferred billing plan:</h4>
                    <p>
                        Bacon ipsum dolor amet flank corned beef leberkas frankfurter, tenderloin jowl bacon. Flank short loin cupim short ribs jerky. Ham hock kielbasa cow salami brisket ground round flank tongue pancetta leberkas bacon t-bone meatball chicken. Jowl bresaola rump pork cow.
                    </p>
                </div>

                <div id="body">
                    <div id="row">
                        <div className="page-center">
                            <div id="pricingCard" className="highlight, highlight-border">
                                <div id="top" className="highlight">&lt; 50 MEMBERS</div>
                                <div id="middle" className="highlight-text">$89<span>/MO</span>
                                </div>
                                <div id="btnOne" className="highlight">GET STARTED</div>

                                <div id="bottom">
                                    <div className="perk">Up to
                                        <b>150 Check Ins</b>/month</div>
                                    <div className="perk">Reach up to
                                        <b>26,250 People</b>
                                    </div>
                                </div>
                            </div>

                            <div id="pricingCard" className="standard, standard-border">
                                <div id="top" className="standard">50+ MEMBERS</div>
                                <div id="middle" className="standard-text">$109<span>/MO</span>
                                </div>
                                <div id="btnOne" className="standard">GET STARTED</div>

                                <div id="bottom">
                                    <div className="perk">Up to
                                        <b>200 Check Ins</b>/month</div>
                                    <div className="perk">Reach up to
                                        <b>35,000 People</b>
                                    </div>
                                </div>
                            </div>

                            <div id="pricingCard" className="standard, standard-border">
                                <div id="top" className="standard">100+ MEMBERS</div>
                                <div id="middle" className="standard-text">$139<span>/MO</span>
                                </div>
                                <div id="btnOne" className="standard">GET STARTED</div>

                                <div id="bottom">
                                    <div className="perk">Up to
                                        <b>300 Check Ins</b>/month</div>
                                    <div className="perk">Reach up to
                                        <b>52,500 People</b>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <br/>
                <div className="form-submit text-right">
                    <Button bsStyle="link" onClick={ () => this.props.onPrevious() }>Previous</Button>
                    <Button bsStyle="primary" disabled={ false } onClick={ () => this.props.onNext() }>
                        Save &amp; Continue
                    </Button>
                </div>
            </div>
        )
    }
}
