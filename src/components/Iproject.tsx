type ProjProps = {
    title: string;
    description: string;
    links: LinkObjs[];
    imageSrc: string;
    type: 'research' | 'other';
    year: number;
}

type LinkObjs = {
    link: string;
    annotation: string;
}

export function Iproject(props : ProjProps) {
    return (
        <div className="flex">
            <h5>The ODIN neuromorphic processor (2016-2020)</h5>

            <div class="2 col card">
                <img id="chip_image" src="images/chips/ODIN.jpg">
            </div>

            <div class="2 col card">
                <p style="text-align:justify">The ODIN 256-neuron 64k-synapse neuromorphic processor (28-nm CMOS) highlights how design constraints on the synapses can be released by offloading most synaptic computations at the neuron level. All synapses embed spike-driven synaptic plasticity (SDSP), while neurons are able to phenomenologically reproduce the 20 Izhikevich behaviors of cortical spiking neurons. At the time of publication, ODIN demonstrated the highest neuron and synapse densities, and the lowest energy per synaptic operation among digital designs.</p>
                <p style="text-align:center"><a class="btn_transparent" href="#FrenkelISCAS17" target="_blank">Synapse block (ISCAS'17)</a> &nbsp; <a class="btn_transparent" href="#FrenkelBioCAS17" target="_blank">Neuron block (BioCAS'17)</a></p>
                <p style="text-align:center"><a class="btn_transparent" href="#FrenkelTBioCAS19a" target="_blank">Chip (Trans. BioCAS'19)</a> &nbsp; <a class="btn_transparent" href="#CeoliniFrenkelShresthaFrontiers20" target="_blank">EMG classif. (Front. Neur.'20)</a></p>
                <p style="text-align:center"><a class="btn_link_2" href="https://github.com/ChFrenkel/ODIN" target="_blank">Open-source HW</a></p>
            </div>
        </div>
    );
}
