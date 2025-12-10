from oumi import train
import yaml

def main():
    # Load training config
    with open("backend/oumi/rl/training.yaml", "r") as f:
        config = yaml.safe_load(f)

    print("🚀 Starting Oumi GRPO RL training...")
    print("Using model:", config["model"]["name"])

    # Run RL training
    train(config)

    print("✅ Training complete! Outputs saved in backend/oumi/rl/outputs")

if __name__ == "__main__":
    main()
