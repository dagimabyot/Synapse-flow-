
# SynapseFlow SUMO Sims

A SUMO + TraCI + Reinforcement Learning workspace for adaptive traffic signal control at a 4-way urban intersection with mixed traffic (cars, minibuses, three-wheelers) and pedestrian-aware reward shaping.

This repository currently includes:

- **Phase 1**: Intersection simulation setup and validation
- **Phase 2**: RL environment, PPO training/evaluation, and baseline comparison scripts

---

## 1) Project Goals

This project is designed to:

- Simulate realistic intersection traffic dynamics in SUMO
- Expose traffic state through TraCI
- Train an RL signal controller using PPO (Stable-Baselines3)
- Compare RL performance against baseline controllers:
  - Fixed-time controller
  - Longest-queue-first heuristic

---

## 2) Current Project Structure

```text
sumo-sims/
├── env/
│   ├── __init__.py
│   └── synapse_env.py
├── rl/
│   ├── train.py
│   ├── evaluate.py
│   ├── evaluate_model_metrics.py
│   ├── baseline_fixed_time.py
│   ├── baseline_longest_queue.py
│   ├── compare_baselines.py
│   └── compare_all_controllers.py
├── sumo_net/
│   ├── intersection.net.xml
│   ├── intersection.rou.xml
│   ├── intersection.sumocfg
│   ├── intersection.add.xml
│   ├── intersection.nod.xml
│   ├── intersection.edg.xml
│   ├── intersection.con.xml
│   ├── intersection.tll.xml
│   └── tls.xml
├── logs/
├── models/
├── tb_log/
├── requirements.txt
├── test_simulation.py
└── README.md
```

---

## 3) Prerequisites

### Software

- **Python** 3.10+ (tested with 3.12)
- **SUMO** installed and accessible from terminal:
  - `sumo --version`
  - `sumo-gui --version`

### Python packages

Installed from `requirements.txt` (includes `traci`, `sumo-rl`, `stable-baselines3[extra]`, `tensorboard`, etc.).

---

## 4) Environment Setup

## Windows (PowerShell)

```powershell
cd C:\Users\hp\Documents\GitHub\ano\sumo-sims
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

## Linux/macOS (bash)

```bash
cd /path/to/sumo-sims
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

Verify:

```bash
python -c "import sumo_rl, stable_baselines3, traci; print('env ready')"
```

---

## 5) Phase 1: Run the Simulation

### A) Launch SUMO GUI

```bash
sumo-gui -c sumo_net/intersection.sumocfg
```

You should see:

- Vehicles moving through the intersection
- Traffic light phase changes
- Pedestrians in simulation demand

### B) TraCI smoke test

```bash
python test_simulation.py
```

This script prints:

- Queue length snapshots (e.g., north-south lane)
- Pedestrian waiting counts

---

## 6) Phase 2: RL Training

### Core custom environment

- `env/synapse_env.py`
- Extends `sumo_rl.SumoEnvironment`
- Adds pedestrian waiting time into observation/reward
- Uses weighted reward:
  - vehicle waiting term
  - pedestrian waiting term

### Train PPO

```powershell
# from project root with .venv activated
$env:TOTAL_TIMESTEPS='50000'
$env:N_ENVS='1'
$env:NUM_SECONDS='3600'
$env:N_STEPS='1024'
$env:BATCH_SIZE='64'
$env:SUMO_SEED='42'
python rl/train.py
```

Model artifact:

- `models/synapseflow_ppo_final.zip`

TensorBoard:

```bash
tensorboard --logdir tb_log
```

---

## 7) Evaluate Trained RL Controller

### Visual evaluation (GUI)

```powershell
$env:USE_GUI='true'
$env:NUM_SECONDS='3600'
python rl/evaluate.py
```

### Metrics-oriented evaluation (JSON output)

```powershell
$env:USE_GUI='false'
$env:NUM_SECONDS='3600'
python rl/evaluate_model_metrics.py
```

Output:

- `logs/ppo_metrics.json`

---

## 8) Baseline Controllers

### A) Fixed-time baseline

```powershell
$env:USE_GUI='false'
$env:NUM_SECONDS='3600'
python rl/baseline_fixed_time.py
```

Output:

- `logs/fixed_time_metrics.json`

### B) Longest-queue-first baseline

```powershell
$env:USE_GUI='false'
$env:NUM_SECONDS='3600'
$env:DECISION_INTERVAL='5'
$env:YELLOW_TIME='3'
python rl/baseline_longest_queue.py
```

Output:

- `logs/longest_queue_metrics.json`

### C) Compare baselines only

```bash
python rl/compare_baselines.py
```

Output:

- `logs/baseline_comparison.json`

---

## 9) Compare PPO vs All Controllers

Run this order:

```bash
python rl/baseline_fixed_time.py
python rl/baseline_longest_queue.py
python rl/evaluate_model_metrics.py
python rl/compare_all_controllers.py
```

Final merged report:

- `logs/all_controller_comparison.json`

---

## 10) Recommended Experiment Protocol

For meaningful report results:

1. Train PPO for **50k–200k** timesteps
2. Keep scenario parameters fixed while comparing controllers:
   - same route file
   - same simulation duration
   - same random seed policy
3. Run each controller multiple times (different seeds) and average metrics
4. Report at least:
   - average vehicle waiting time
   - average pedestrian waiting time
   - throughput proxy (arrivals)

---

## 11) Troubleshooting

### `sumo` / `sumo-gui` not found

- Ensure SUMO is installed and in PATH
- Verify with:
  - `sumo --version`
  - `sumo-gui --version`

### TraCI connection errors (`Could not connect`)

- Usually caused by SUMO startup failure in background
- Check previous console logs for the root SUMO option error
- Retry with fewer envs (`N_ENVS=1`) and shorter runs

### Seed parsing errors in SUMO

- SUMO expects 32-bit signed integer range
- Use `SUMO_SEED=42` (already supported in training script)

### PPO underperforming baseline

- Expected if model was trained for very few timesteps
- Increase `TOTAL_TIMESTEPS`, then re-run full comparison

### Slow training

- Reduce `NUM_SECONDS`
- Reduce `N_ENVS` to 1 on limited hardware
- Start with `TOTAL_TIMESTEPS=5000` sanity run, then scale up

---

## 12) Useful Command Cheatsheet

```powershell
# Activate environment (Windows)
.\.venv\Scripts\Activate.ps1

# Install dependencies
pip install -r requirements.txt

# Run GUI simulation
sumo-gui -c sumo_net/intersection.sumocfg

# TraCI smoke test
python test_simulation.py

# Train PPO
$env:TOTAL_TIMESTEPS='50000'; python rl/train.py

# Evaluate PPO with GUI
$env:USE_GUI='true'; python rl/evaluate.py

# Baselines + all-controller comparison
python rl/baseline_fixed_time.py
python rl/baseline_longest_queue.py
python rl/evaluate_model_metrics.py
python rl/compare_all_controllers.py
```

---

## 13) Notes

- This repository is currently single-intersection focused.
- Additional modules (`cv/`, `dashboard/`, `data/`) are scaffolded for future phases.
- You can adapt the SUMO network geometry and route demand in `sumo_net/` for new experiments.

---

## 14) Next Suggested Enhancements

- Multi-seed experiment runner (automated statistical comparison)
- CSV/plot export for publication-ready charts
- Reward ablation (`w_ped` vs `w_veh`) with sensitivity analysis
- Multi-intersection scaling
